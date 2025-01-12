const mongoose = require("mongoose");
const Address = require("../models/Address"); // Adjust path if necessary

describe("Address Schema Tests", () => {
  

    

    it("should create a new address successfully", async () => {
        const address = new Address({
            userId: "12345",
            address: "123 Elm Street",
            city: "Metropolis",
            pincode: "12345",
            phone: "1234567890",
            notes: "This is a note",
        });

        const savedAddress = await address.save();
        expect(savedAddress._id).toBeDefined();
        expect(savedAddress.userId).toBe("12345");
    });

    it("should fail to create an address without required fields", async () => {
        const address = new Address({}); // Empty fields

        try {
            await address.save();
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error);
        }
    });

    it("should fail for invalid pincode format", async () => {
        const address = new Address({
            userId: "123456",
            address: "456 Pine Avenue",
            city: "Smallville",
            pincode: "ABCDE", // Invalid format
            phone: "1234567890",
        });

        try {
            await address.save();
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error);
        }
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
});
