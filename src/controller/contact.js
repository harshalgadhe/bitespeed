import { INTEGER, Op } from "sequelize";
import ContactModel from "../database/contact.js";

//TODO: Handle delete contact scenario

export const getContactIdentity = async(req, res) => {
    console.log(req.body)
    let {email, phoneNumber} = req.body;

    email = String(email)
    phoneNumber = String(phoneNumber)

    let contact_data = {}

    const primaryContact = await getPrimaryContact(email, phoneNumber);

    if(primaryContact === null){
        return createContact(req, res);
    }

    contact_data = await getAllContacts(primaryContact);
    
    res.send(
        {"contact":contact_data}
    )
}


export const createContact = async (req, res) => {
    let {email, phoneNumber} = req.body;
    
    email = String(email)
    phoneNumber = String(phoneNumber)

    if(email === "" && phoneNumber === ""){
        res.send("Both email and phone number can't be empty");
        return;
    }

    const contact = await getPrimaryContact(email, phoneNumber);
    
    let data = {
        email: email,
        phoneNumber: phoneNumber,
    }

    if(contact != null ){
        if(await isContactExisting(email, phoneNumber)){
            res.send("Contact details with this email and phone number already exists");
            return;
        }

        data["linkPrecedence"] = "secondary";
        data["linkedId"] = contact.id;
    }

    console.log(data);

    await ContactModel.create(data).then(contact => {
        contact = contact.toJSON();
        console.log('Contact created:', contact);
        res.send(`Successfully Created contact with id ${contact.id}`)
    }).catch(err => {
        console.error('Error creating contact:', err);
    });
}

const isContactExisting = async(email, phoneNumber) => {
    const contact = await ContactModel.findOne({
        where: {
            [Op.and] : [
                {email:email},
                {phoneNumber:phoneNumber}
            ]
        }
    })
    return contact != null;
}

const getPrimaryContact = async(email, phoneNumber) => {
    const contact = await ContactModel.findOne({
        where: {
            [Op.or] : [
                {email: email},
                {phoneNumber: phoneNumber}
            ],
            [Op.and] : [
                {linkPrecedence: 'primary'}
            ]
        }
    })
    return contact;
}

const getAllContacts = async(primaryContact) => {

    let contactsData = {};
    if(primaryContact != null) {
        contactsData["primaryContactId"] = primaryContact.id;

        const contacts = await ContactModel.findAll({
            where: { linkedId: primaryContact.id}
        });
        
        contactsData["emails"] = primaryContact.email === "" ? [] : [primaryContact.email]
        contactsData["phoneNumbers"] = primaryContact.phoneNumber === "" ? [] : [Number(primaryContact.phoneNumber)]
        contactsData["secondaryContactIds"] = [];

        contacts.forEach( contact => {
            let email = contact["email"];
            let phoneNumber = Number(contact["phoneNumber"]);

            if(!contactsData["emails"].includes(email) && email != "") contactsData["emails"].push(email);

            if(!contactsData["phoneNumbers"].includes(phoneNumber) && phoneNumber != "") contactsData["phoneNumbers"].push(phoneNumber);

            contactsData["secondaryContactIds"].push(contact.id);
        });
    }

    return contactsData;
    
}