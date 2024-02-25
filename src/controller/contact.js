import { INTEGER, Op } from "sequelize";
import ContactModel from "../database/contact.js";

//TODO: Handle delete contact scenario

export const getContactIdentity = async(req, res) => {
    let {email,phoneNumber} = req.body;

    email = String(email);
    phoneNumber = String(phoneNumber);

    email = email === "null" ? "" : email;
    phoneNumber = phoneNumber === "null" ? "" : phoneNumber;


    if(email === "undefined" || phoneNumber === "undefined")
        return res.send("Either email or phoneNumber field is missing");
    
    if( email === "" && phoneNumber === "") 
        return res.send("Both email and phoneNumber cant be empty");

    const primaryContact = await getPrimaryContact(email, phoneNumber);

    if(primaryContact === null){
        return res.send("Some error occured while finding the identity");
    }
    
    return res.send(await getIdentity(primaryContact));
    
}

const getIdentity = async (primaryContact) => {
    const contacts = await ContactModel.findAll({
        where: {
            linkedId: primaryContact.id
        }
    });

    const contactData = {
        primaryContactId: primaryContact.id,
        emails: primaryContact.email ? [primaryContact.email] : [],
        phoneNumbers: primaryContact.phoneNumber ? [primaryContact.phoneNumber] : [],
        secondaryContactIds: contacts.map(contact => contact.id)
    };

    contacts.forEach(contact => {
        if (contact.email && !contactData.emails.includes(contact.email)) {
            contactData.emails.push(contact.email);
        }
        if (contact.phoneNumber && !contactData.phoneNumbers.includes(contact.phoneNumber)) {
            contactData.phoneNumbers.push(contact.phoneNumber);
        }
    });

    return { contact: contactData };
}

const getPrimaryContact = async(email,phoneNumber) => {
    let primaryContact;
    let contacts = await ContactModel.findAll({
        where: {
            [Op.or] : [
                {email: email},
                {phoneNumber:phoneNumber}
            ],
            [Op.and] : [
                {linkPrecedence: 'primary'}
            ]
        },
        order: [['createdAt', "ASC"]]
    });

    if(contacts.length == 0){
        primaryContact = await createContact(email,phoneNumber);
    } else if(contacts.length == 1){
        primaryContact = contacts[0];
    } else {
        primaryContact = contacts[0];
        updatePrimaryContact(contacts);
    }

    return primaryContact;
}

const createContact = async(email,phoneNumber) => {
    try{
        const data = ContactModel.create({
            email:email,
            phoneNumber:phoneNumber
           
        });
        console.log("Successfully created new contact")
        return data;
    } catch(e) {
        console.log(e);
        return null;
    }
}

const updateLinkedId = async (currLinkedId, newLinkedId) => {
    await ContactModel.update({
        linkedId:newLinkedId},
        {where:{
            linkedId:currLinkedId
        }
    });
    console.log("Updated all child contacts");
}

const updatePrimaryContact = async(contacts) => {
    const primaryContact = contacts[0];

    for(let i=1;i<contacts.length;i++){
        await contacts[i].update({linkPrecedence:"secondary", linkedId:primaryContact.id});
        await updateLinkedId(contacts[i].id, primaryContact.id)
    }
    console.log("Updated all primary contacts except for oldest primary contact to secondary");
}