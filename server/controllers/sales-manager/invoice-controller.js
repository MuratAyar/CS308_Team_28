const fs = require("fs");
const path = require("path");

const getInvoicesByDateRange = (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Start and end dates are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: "Invalid date format." });
    }

    const invoicesDir = path.join(__dirname, "../../invoices");

    fs.readdir(invoicesDir, (err, files) => {
        if (err) {
            console.error("Error reading invoices directory:", err);
            return res.status(500).json({ error: "Server error." });
        }

        // Filter files by creation date
        const filteredInvoices = files.filter((file) => {
            const filePath = path.join(invoicesDir, file);
            const stats = fs.statSync(filePath);

            const fileDate = new Date(stats.mtime); // Using modified time as an example
            return fileDate >= start && fileDate <= end;
        });

        res.status(200).json({ invoices: filteredInvoices });
    });
};

module.exports = { getInvoicesByDateRange };
