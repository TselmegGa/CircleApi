module.exports = {
    generateCertificate: (csrPem) => {
      const forge = require("node-forge");
      const fs = require("fs");
      const pki = forge.pki;
      const path = require("path");

      const csr = forge.pki.certificationRequestFromPem(csrPem);
  
      const caCertPem = fs.readFileSync(path.resolve(__dirname, "CA/rootCACert.pem"), {
        encoding: "utf-8",
      });
      const caKeyPem = fs.readFileSync(path.resolve(__dirname,"CA/rootCAKey.pem"), {
        encoding: "utf-8",
      });
      const caCert = forge.pki.certificateFromPem(caCertPem);
      const caKey = forge.pki.privateKeyFromPem(caKeyPem);

      // create a new certificate
      const cert = pki.createCertificate();
  
      // fill the required fields
      cert.publicKey = csr.publicKey;
      cert.serialNumber = "01";
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      cert.validity.notAfter.setFullYear(
        cert.validity.notBefore.getFullYear() + 1
      );
  
      // here we set subject and issuer as the same one
      cert.setSubject(csr.subject.attributes);
      cert.setIssuer(caCert.subject.attributes);
  
      // the actual certificate signing
      cert.sign(caKey);
  
      // now convert the Forge certificate to PEM format
      return pki.certificateToPem(cert);
    },

    generateCSR: (privateKey, publicKey) => {

        const forge = require("node-forge");
        const pki = forge.pki;
    
    
        const prKey = pki.privateKeyFromPem(privateKey);
        const pubKey = pki.publicKeyFromPem(publicKey);
    
        // generate a key pair
        // const keys = forge.pki.rsa.generateKeyPair(1024);
    
        // create a certification request (CSR)
        const csr = forge.pki.createCertificationRequest();
        csr.publicKey = pubKey;
        csr.setSubject([
          {
            name: "commonName",
            value: "example.org",
          },
          {
            name: "countryName",
            value: "US",
          },
          {
            shortName: "ST",
            value: "Virginia",
          },
          {
            name: "localityName",
            value: "Blacksburg",
          },
          {
            name: "organizationName",
            value: "Test",
          },
          {
            shortName: "OU",
            value: "Test",
          },
        ]);
    
        // sign certification request
        csr.sign(prKey);

        // convert certification request to PEM-format

        return forge.pki.certificationRequestToPem(csr);
      },
  };