const mongoose = require("mongoose");
const Address = require("../models/Address");


describe("Address Schema Tests", () => {
    afterEach(async () => {
        await Address.deleteMany({});
    });

    it("should create a new address successfully", async () => {
        const address = new Address({
            userId: "12345",
            address: "123 Elm Street",
            city: "Metropolis",
            pincode: "12345",
            phone: "1234567890",
        });

        const savedAddress = await address.save();
        expect(savedAddress._id).toBeDefined();
        expect(savedAddress.userId).toBe("12345");
        expect(savedAddress.address).toBe("123 Elm Street");
    });



    it("should update an existing address successfully", async () => {
        const address = new Address({
            userId: "12345",
            address: "123 Elm Street",
            city: "Metropolis",
            pincode: "12345",
            phone: "1234567890",
        });

        const savedAddress = await address.save();
        savedAddress.city = "Gotham";
        const updatedAddress = await savedAddress.save();

        expect(updatedAddress.city).toBe("Gotham");
    });

    it("should delete an address successfully", async () => {
        const address = new Address({
            userId: "12345",
            address: "123 Elm Street",
            city: "Metropolis",
            pincode: "12345",
            phone: "1234567890",
        });

        const savedAddress = await address.save();
        await Address.findByIdAndDelete(savedAddress._id);

        const deletedAddress = await Address.findById(savedAddress._id);
        expect(deletedAddress).toBeNull();
    });

    it("should automatically add timestamps", async () => {
        const address = new Address({
            userId: "67890",
            address: "789 Maple Street",
            city: "Star City",
            pincode: "98765",
            phone: "9876543210",
        });

        const savedAddress = await address.save();
        expect(savedAddress.createdAt).toBeDefined();
        expect(savedAddress.updatedAt).toBeDefined();
        expect(savedAddress.createdAt).toEqual(savedAddress.updatedAt);
    });

    it("should update only specific fields without affecting others", async () => {
        const address = new Address({
            userId: "67890",
            address: "789 Maple Street",
            city: "Star City",
            pincode: "98765",
            phone: "9876543210",
        });

        const savedAddress = await address.save();
        savedAddress.city = "Central City";
        const updatedAddress = await savedAddress.save();

        expect(updatedAddress.city).toBe("Central City");
        expect(updatedAddress.address).toBe("789 Maple Street");
    });

    it("should allow duplicate addresses for the same user", async () => {
        const address1 = new Address({
            userId: "12345",
            address: "1010 Binary Lane",
            city: "Tech City",
            pincode: "11111",
            phone: "9998887777",
        });

        const address2 = new Address({
            userId: "12345",
            address: "1010 Binary Lane",
            city: "Tech City",
            pincode: "11111",
            phone: "9998887777",
        });

        await address1.save();
        const savedAddress2 = await address2.save();

        expect(savedAddress2._id).toBeDefined();
        expect(savedAddress2.userId).toBe("12345");
    });

    it("should retrieve addresses by userId", async () => {
        const address1 = new Address({
            userId: "12345",
            address: "123 Elm Street",
            city: "Metropolis",
            pincode: "12345",
            phone: "1234567890",
        });

        const address2 = new Address({
            userId: "12345",
            address: "456 Pine Avenue",
            city: "Metropolis",
            pincode: "54321",
            phone: "9876543210",
        });

        await address1.save();
        await address2.save();

        const addresses = await Address.find({ userId: "12345" });
        expect(addresses).toHaveLength(2);
        expect(addresses[0].userId).toBe("12345");
        expect(addresses[1].userId).toBe("12345");
    });

    it("should delete all addresses for a specific userId", async () => {
        const address1 = new Address({
            userId: "12345",
            address: "123 Elm Street",
            city: "Metropolis",
            pincode: "12345",
            phone: "1234567890",
        });

        const address2 = new Address({
            userId: "12345",
            address: "456 Pine Avenue",
            city: "Metropolis",
            pincode: "54321",
            phone: "9876543210",
        });

        await address1.save();
        await address2.save();

        await Address.deleteMany({ userId: "12345" });
        const addresses = await Address.find({ userId: "12345" });

        expect(addresses).toHaveLength(0);
    });
});
