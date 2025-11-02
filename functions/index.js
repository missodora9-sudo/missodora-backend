const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// --- Config Mail ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "missodora9@gmail.com",
    pass: "daigobsekzxbetkl", // mot de passe d'application
  },
});

// Fonction déclenchée quand une commande est payée
exports.sendInvoice = functions.firestore
  .document("commandes/{commandeId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Si le statut passe à "Payée"
    if (before.statut !== "Payée" && after.statut === "Payée") {
      try {
        const commande = after;
        const user = commande.user; // email + prénom

        // --- Génération HTML de la facture ---
        const produitsHTML = (commande.articles || [])
          .map(
            (item) => `
            <tr style="border-bottom:1px solid #e0e0e0;">
              <td style="padding:10px;">${item.nom}</td>
              <td style="padding:10px;text-align:center;">
                ${item.quantite}
              </td>
              <td style="padding:10px;text-align:right;">
                ${item.prix.toFixed(2)} €
              </td>
              <td style="padding:10px;text-align:right;color:#2c5530;font-weight:600;">
                ${(item.prix * item.quantite).toFixed(2)} €
              </td>
            </tr>`
          )
          .join("");

        const html = `
        <html>
          <head><meta charset="UTF-8"/></head>
          <body style="font-family:sans-serif;padding:40px;">
            <h1>Facture MissOdora</h1>
            <p>Bonjour ${user.prenom || ""}, votre commande est confirmée.</p>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Qté</th>
                  <th>Prix</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${produitsHTML}
              </tbody>
            </table>
            <p>Sous-total HT : ${commande.totalHT.toFixed(2)} €</p>
            <p>TVA : ${commande.totalTVA.toFixed(2)} €</p>
            <p><strong>Total TTC : ${commande.totalTTC.toFixed(2)} €</strong></p>
          </body>
        </html>`;

        // --- Mail au client + copie cachée à l'équipe ---
        const mailOptions = {
          from: "missodora9@gmail.com",
          to: user.email,
          bcc: "missodora9@gmail.com",
          subject: `Votre facture MissOdora - Commande ${context.params.commandeId}`,
          html,
        };

        await transporter.sendMail(mailOptions);
        console.log("Facture envoyée avec succès !");
      } catch (err) {
        console.error("Erreur lors de l'envoi de la facture :", err);
      }
    }
    return null;
  });
