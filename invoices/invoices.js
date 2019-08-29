const XeroClient = require('xero-node').AccountingAPIClient;

const config = {
	appType: 'private',
	consumerKey: 'ZYYQV2BAOIU1OBHI1YZIEIFLACDG5A',
	consumerSecret: '7EQGMZMMRCLEEID4ETE01ET00L7BM9',
	privateKeyPath: 'privatekey.pem'
};

var xero = new XeroClient(config);

async function handler() {
	// const response = {
	// 	statusCode: 200,
	// 	body: JSON.stringify(xeroAddContact())
	// };
	// return response;
}

async function xeroAddContact() {
	let xero = new XeroClient(config);

	// await xero.contacts.create({
	// 	Name: 'Test Contact'
	// });

	const res = await xero.contacts.get({
		where: 'EmailAddress="mfracso@skytrend.ma"'
	});

	var i = 0;
	while (res.Contacts[i] != null) i++;
	console.log('Contacts count: ', i);

	console.log('First contact: ', res.Contacts[0]);
	return res.Contacts;
}

async function getContactUID(email) {
	let xero = new XeroClient(config);

	const res = await xero.contacts.get({
		where: `EmailAddress="${email}"`
	});

	return res.Contacts[0].ContactID;
}

async function xeroGetClientInvoicesByEmail(email) {
	const contactUID = await getContactUID(email);
	const res = xero.invoices
		.get({
			// where: 'Total > 6000' <-- it works
			// where: 'InvoiceID=GUID("cb43aadd-8836-4e95-aa2c-c4ba66c2ca9e")' <-- it works
			where: `Contact.ContactID=GUID("${contactUID}")`
		})
		.then((res) => {
			console.log('invoices: ', res);
		});
}

async function xeroUpdateClientData(
	email,
	{ newFirstName, newLastName, newEmailAddress, newAddressesArray, newPhonesArray, IsSupplierBool, IsCustomerBool }
) {
	let xero = new XeroClient(config);

	/*
		The second arg containing the new data was passed in order to secure the API,
		a potential malicious user could pass any data through the second arg in order
		to manipulate data for his own good, for example passing a balance arg to update
		his account balance
		That is the reason why we forced the second arg to only containt the attributes
		that belongs to the arg object

		In the if statements below, we test the existence of the attributes sent within a request,
		because the user will certainly need to update only a few attributes instead of them all
	*/
	var newData = {};

	if (newEmailAddress) newData.EmailAddress = newEmailAddress;

	if (newFirstName) newData.FirstName = newFirstName;

	if (newLastName) newData.LastName = newLastName;

	if (newAddressesArray) newData.Addresses = newAddressesArray;

	if (newPhonesArray) newData.Phones = newPhonesArray;

	if (IsSupplierBool) newData.IsSupplier = IsSupplierBool;

	if (IsCustomerBool) newData.IsCustomer = IsCustomerBool;

	console.log(newData);
	const res = await xero.contacts.get({
		where: `EmailAddress="${email}"`
	});

	const res2 = xero.contacts
		.update(newData, {
			ContactID: `cbe343e2-308e-41b2-9f05-1331438856f1`
		})
		.then((res) => {
			console.log(res);
		});
}

// xeroAddContact(); <-- IT works
// xeroGetClientInvoicesByEmail('mfracso@skytrend.ma'); <-- It works
// xeroUpdateClientData('mehdifracso@gmail.com', { newEmailAddress: 'newEmail@mail.com' }); <-- It works
