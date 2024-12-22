const express = require("express");
const router = express.Router();
const { getInvoicesByDateRange } = require("../controllers/sales-manager/invoice-controller");

router.get("/invoices", getInvoicesByDateRange);

module.exports = router;
