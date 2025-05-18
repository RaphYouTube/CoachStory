document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments du DOM
    const nomClubInput = document.getElementById('nom-club');
    const budgetTotalActuelInput = document.getElementById('budget-total-actuel');
    const nomStadeInput = document.getElementById('nom-stade');
    const capaciteStadeInput = document.getElementById('capacite-stade');
    const validerInfosClubButton = document.getElementById('valider-infos-club');
    const moisSaisonSelect = document.getElementById('mois-saison-select');
    const validerMoisSaisonButton = document.getElementById('valider-mois-saison');
    const spectateursInput = document.getElementById('spectateurs');
    const revenuBilletterieSpan = document.getElementById('revenu-billetterie');
    const validerBilletterieButton = document.getElementById('valider-billetterie');
    const revenuMerchandisingSpan = document.getElementById('revenu-merchandising');
    const genererRevenuMerchandisingButton = document.getElementById('generer-revenu-merchandising');
    const validerMerchandisingButton = document.getElementById('valider-merchandising');
    const sponsorABloc = document.getElementById('sponsor-a-bloc');
    const sponsorBBloc = document.getElementById('sponsor-b-bloc');
    const sponsorCBloc = document.getElementById('sponsor-c-bloc');
    const sponsorDBloc = document.getElementById('sponsor-d-bloc');
    const revenuSponsorsSpan = document.getElementById('revenu-sponsors');
    const signerSponsorsButton = document.getElementById('signer-sponsors');
    const classementChampionnatSelect = document.getElementById('classement-championnat');
    const revenuDroitsTvSpan = document.getElementById('revenu-droits-tv');
    const validerDroitsTvButton = document.getElementById('valider-droits-tv');
    const salaireTotalInput = document.getElementById('salaire-total');
    const deduireSalairesButton = document.getElementById('deduire-salaires');
    const nombreStaffInput = document.getElementById('nombre-staff');
    const coutStaffSpan = document.getElementById('cout-staff');
    const deduireStaffButton = document.getElementById('deduire-staff');
    const deduireEntretienButton = document.getElementById('deduire-entretien');
    const validerEntretienButton = document.getElementById('valider-entretien');
    const listeEntretien = document.getElementById('liste-entretien');
    const nomJoueurTransfertInput = document.getElementById('nom-joueur-transfert');
    const depensesTransfertsInput = document.getElementById('depenses-transferts');
    const validerTransfertsButton = document.getElementById('valider-transferts');
    const budgetTotalSpan = document.getElementById('budget-total');
    const sauvegarderButton = document.getElementById('sauvegarder');
    const chargerInput = document.getElementById('charger');
    const resumeTransactionsList = document.getElementById('resume-transactions');
    const telechargerFactureButton = document.getElementById('telecharger-facture');

    const sponsorPopup = document.getElementById('sponsor-popup');
    const sponsorPopupNom = document.getElementById('sponsor-popup-nom');
    const sponsorPopupRevenu = document.getElementById('sponsor-popup-revenu');
    const sponsorPopupDemande = document.getElementById('sponsor-popup-demande');
    const sponsorPopupConditions = document.getElementById('sponsor-popup-conditions');
    const sponsorPopupSigner = document.getElementById('sponsor-popup-signer');
    const sponsorPopupFermer = document.getElementById('sponsor-popup-fermer');

    let budget = 0; // Initialisation du budget
    let transactions = []; // Tableau pour stocker les transactions
    let clubInfosValidees = false;
    let moisSaisonValide = false;
    let sponsorsDisponibles = [
        { nom: "Décathlon", revenu: 15000, demande: "Place offerte pour 10 matchs", conditions: "Renouvellement si +15% de visibilité" },
        { nom: "Burger King", revenu: 20000, demande: "Loges VIP toute la saison", conditions: "Renouvellement si le club gagne un trophée" },
        { nom: "Boulanger", revenu: 18000, demande: "Offre CE pour les employés", conditions: "Renouvellement si le stade est rempli à 80%" },
        { nom: "Conforama", revenu: 22000, demande: "Panneaux publicitaires LED", conditions: "Renouvellement si le club est dans le top 5" }
    ];
    let sponsorsSelectionnes = [];
    let revenuTotalSponsors = 0;
    let sponsorSelectionneMontant = 0;
    let nomClub = '';
    let entretienParMatch = 800;
    let totalEntretien = 0;
    let droitsTvMontant = 0;

    function afficherBudget() {
        budgetTotalSpan.textContent = budget;
    }

    function ajouterTransaction(type, montant, details = '') {
        transactions.push({ type, montant, details });
        const li = document.createElement('li');
        let signe = montant >= 0 ? '+' : '';
        li.textContent = `${type}: ${signe}${montant} GP ${details}`;
        resumeTransactionsList.appendChild(li);
    }

    // Initialisation des sponsors
    function initialiserSponsors() {
        sponsorsDisponibles.forEach(sponsor => {
            let option1 = document.createElement('option');
            option1.value = sponsor.nom;
            option1.textContent = sponsor.nom;
            sponsorPrincipal1Select.appendChild(option1);

            let option2 = document.createElement('option');
            option2.value = sponsor.nom;
            option2.textContent = sponsor.nom;
            sponsorPrincipal2Select.appendChild(option2);
        });
    }

    function calculerBilletterie() {
        const spectateurs = parseInt(spectateursInput.value) || 0;
        const revenu = spectateurs * 0.5;
        revenuBilletterieSpan.textContent = revenu.toFixed(1);
        return revenu;
    }

    function genererRevenuMerchandising() {
        const revenu = Math.floor(Math.random() * (3000 - 500 + 1)) + 500;
        revenuMerchandisingSpan.textContent = revenu;
        return revenu;
    }

    function calculerDroitsTv() {
        const classement = classementChampionnatSelect.value;
        let revenu = 0;
        if (classement === '1-10') {
            revenu = 30000;
        } else if (classement === '11-15') {
            revenu = 20000;
        } else if (classement === '16+') {
            revenu = 10000;
        }
        revenuDroitsTvSpan.textContent = revenu;
        droitsTvMontant = revenu;
        return revenu;
    }

    function calculerStaff() {
        const nombreStaff = parseInt(nombreStaffInput.value) || 0;
        const cout = nombreStaff * 500;
        coutStaffSpan.textContent = cout;
        return cout;
    }

    function afficherSponsorPopup(sponsorNom) {
        const sponsor = sponsorsDisponibles.find(s => s.nom === sponsorNom);
        if (sponsor) {
            sponsorPopupNom.textContent = sponsor.nom;
            sponsorPopupRevenu.textContent = sponsor.revenu;
            sponsorPopupDemande.textContent = sponsor.demande;
            sponsorPopupConditions.textContent = sponsor.conditions;
            sponsorPopup.style.display = 'flex';
            sponsorPopupSigner.onclick = () => {
                if (!sponsorsSelectionnes.includes(sponsor.nom)) {
                    sponsorSelectionneMontant = sponsor.revenu;
                    revenuSponsorsSpan.textContent = sponsor.revenu;
                    sponsorPopup.style.display = 'none';
                    // Désactiver le bloc sponsor après la signature
                    document.getElementById(`sponsor-${sponsor.nom.toLowerCase()}-bloc`).classList.add('disabled');
                    document.getElementById(`sponsor-${sponsor.nom.toLowerCase()}-bloc`).onclick = null;
                    sponsorsSelectionnes.push(sponsor.nom);
                    signerSponsorsButton.disabled = sponsorsSelectionnes.length >= 2;
                } else {
                    alert("Ce sponsor a déjà été sélectionné.");
                }
            };
        }
    }

    // Événements
    validerInfosClubButton.addEventListener('click', () => {
        nomClub = nomClubInput.value;
        budget = parseInt(budgetTotalActuelInput.value) || 0;
        afficherBudget();
        clubInfosValidees = true;
        // Désactiver les champs et le bouton après la validation
        nomClubInput.disabled = true;
        budgetTotalActuelInput.disabled = true;
        nomStadeInput.disabled = true;
        capaciteStadeInput.disabled = true;
        validerInfosClubButton.disabled = true;
    });

    validerMoisSaisonButton.addEventListener('click', () => {
        moisSaisonValide = true;
        const moisSelectionne = moisSaisonSelect.value;

        // Activer/désactiver les salaires selon le mois
        salaireTotalInput.disabled = false;
        deduireSalairesButton.disabled = false;

        // Activer/désactiver le staff selon le mois
        deduireStaffButton.disabled = false;

        // Activer/désactiver les droits TV
        classementChampionnatSelect.disabled = moisSelectionne === 'mai' ? false : true;
        validerDroitsTvButton.disabled = moisSelectionne === 'mai' ? false : true;
        moisSaisonSelect.disabled = true;
        validerMoisSaisonButton.disabled = true;
        document.getElementById('mois-saison').classList.add('disabled');
        // Activer/désactiver le bloc sponsors
        const sponsorsSection = document.getElementById('sponsors');
        sponsorsSection.classList.toggle('disabled', moisSelectionne !== 'juillet');
        if (moisSelectionne !== 'juillet') {
            sponsorABloc.onclick = null;
            sponsorBBloc.onclick = null;
            sponsorCBloc.onclick = null;
            sponsorDBloc.onclick = null;
        } else {
            sponsorABloc.onclick = () => afficherSponsorPopup('Décathlon');
            sponsorBBloc.onclick = () => afficherSponsorPopup('Burger King');
            sponsorCBloc.onclick = () => afficherSponsorPopup('Boulanger');
            sponsorDBloc.onclick = () => afficherSponsorPopup('Conforama');
        }
        // Activer/désactiver le bloc transferts
        const transfertsSection = document.getElementById('transferts');
        transfertsSection.style.display = (moisSelectionne === 'juillet' || moisSelectionne === 'août' || moisSelectionne === 'décembre' || moisSelectionne === 'janvier') ? 'block' : 'none';
    });

    moisSaisonSelect.addEventListener('change', () => {
        const moisSelectionne = moisSaisonSelect.value;
        const moisMercatoHiver = ['décembre', 'janvier'];
        const moisMercatoEte = ['juillet', 'août'];
        const moisFinSaison = 'mai';

        // Activer/désactiver les salaires selon le mois
        salaireTotalInput.disabled = false;
        deduireSalairesButton.disabled = false;

        // Activer/désactiver le staff selon le mois
        deduireStaffButton.disabled = moisSelectionne === 'août' ? false : true;

        // Activer/désactiver les droits TV
        classementChampionnatSelect.disabled = moisSelectionne === 'mai' ? false : true;
        validerDroitsTvButton.disabled = moisSelectionne === 'mai' ? false : true;
        // Activer/désactiver le bloc sponsors
        const sponsorsSection = document.getElementById('sponsors');
        sponsorsSection.classList.toggle('disabled', moisSelectionne !== 'juillet');
        if (moisSelectionne !== 'juillet') {
            sponsorABloc.onclick = null;
            sponsorBBloc.onclick = null;
            sponsorCBloc.onclick = null;
            sponsorDBloc.onclick = null;
        } else {
            sponsorABloc.onclick = () => afficherSponsorPopup('Décathlon');
            sponsorBBloc.onclick = () => afficherSponsorPopup('Burger King');
            sponsorCBloc.onclick = () => afficherSponsorPopup('Boulanger');
            sponsorDBloc.onclick = () => afficherSponsorPopup('Conforama');
        }
        // Activer/désactiver le bloc transferts
        const transfertsSection = document.getElementById('transferts');
        transfertsSection.style.display = (moisSelectionne === 'juillet' || moisSelectionne === 'août' || moisSelectionne === 'décembre' || moisSelectionne === 'janvier') ? 'block' : 'none';
    });

    validerBilletterieButton.addEventListener('click', () => {
        const revenu = calculerBilletterie();
        budget += revenu;
        ajouterTransaction('Billetterie', revenu, `(${spectateursInput.value} spectateurs)`);
        afficherBudget();
    });

    genererRevenuMerchandisingButton.addEventListener('click', genererRevenuMerchandising);

    validerMerchandisingButton.addEventListener('click', () => {
        const revenu = parseInt(revenuMerchandisingSpan.textContent) || 0;
        budget += revenu;
        ajouterTransaction('Merchandising', revenu);
        afficherBudget();
    });

    sponsorABloc.addEventListener('click', () => afficherSponsorPopup('Décathlon'));
    sponsorBBloc.addEventListener('click', () => afficherSponsorPopup('Burger King'));
    sponsorCBloc.addEventListener('click', () => afficherSponsorPopup('Boulanger'));
    sponsorDBloc.addEventListener('click', () => afficherSponsorPopup('Conforama'));

    sponsorPopupFermer.addEventListener('click', () => {
        sponsorPopup.style.display = 'none';
    });

    signerSponsorsButton.addEventListener('click', () => {
        revenuTotalSponsors += sponsorSelectionneMontant;
        budget += revenuTotalSponsors;
        ajouterTransaction('Sponsors', revenuTotalSponsors, `(${sponsorsSelectionnes.join(', ')})`);
        revenuSponsorsSpan.textContent = revenuTotalSponsors;
        afficherBudget();
        signerSponsorsButton.disabled = true;
        sponsorSelectionneMontant = 0;
    });

    validerDroitsTvButton.addEventListener('click', () => {
        const droitsTv = calculerDroitsTv();
        budget += droitsTv;
        ajouterTransaction('Droits TV', droitsTv);
        afficherBudget();
    });

    deduireSalairesButton.addEventListener('click', () => {
        const salaires = parseInt(salaireTotalInput.value) || 0;
        budget -= salaires;
        ajouterTransaction('Salaires', -salaires);
        afficherBudget();
    });

    deduireStaffButton.addEventListener('click', () => {
        const staffCost = calculerStaff();
        budget -= staffCost;
        ajouterTransaction('Staff', -staffCost);
        afficherBudget();
    });

    deduireEntretienButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.textContent = `Entretien: ${entretienParMatch} GP`;
        listeEntretien.appendChild(li);
        totalEntretien += entretienParMatch;
    });

    validerEntretienButton.addEventListener('click', () => {
        budget -= totalEntretien;
        ajouterTransaction('Entretien', -totalEntretien, `(Total)`);
        afficherBudget();
        totalEntretien = 0;
        listeEntretien.innerHTML = '';
    });

    validerTransfertsButton.addEventListener('click', () => {
        const nomJoueur = nomJoueurTransfertInput.value;
        const transferts = parseInt(depensesTransfertsInput.value) || 0;
        budget -= transferts;
        ajouterTransaction('Transferts', -transferts, nomJoueur ? `(${nomJoueur})` : '');
        afficherBudget();
    });

    // Sauvegarde des données
    sauvegarderButton.addEventListener('click', () => {
        const data = {
            nomClub: nomClub,
            budget: budget,
            nomStade: nomStadeInput.value,
            capaciteStade: capaciteStadeInput.value,
            moisSaison: moisSaisonSelect.value,
            spectateurs: spectateursInput.value,
            sponsorsSelectionnes: sponsorsSelectionnes,
            salaireTotal: salaireTotalInput.value,
            nombreStaff: nombreStaffInput.value,
            depensesTransferts: parseInt(depensesTransfertsInput.value) || 0,
            nomJoueurTransfert: nomJoueurTransfertInput.value,
            transactions: transactions,
            clubInfosValidees: clubInfosValidees,
            moisSaisonValide: moisSaisonValide,
            revenuTotalSponsors: revenuTotalSponsors,
            totalEntretien: totalEntretien,
            droitsTvMontant: droitsTvMontant
        };
        const jsonData = JSON.stringify(data);
        const blob = new Blob([jsonData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gestion_financiere.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Données sauvegardées dans gestion_financiere.txt');
    });

    // Chargement des données
    chargerInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    nomClub = data.nomClub || '';
                    nomClubInput.value = nomClub;
                    budget = data.budget || 0;
                    budgetTotalActuelInput.value = data.budget || 0;
                    nomStadeInput.value = data.nomStade || '';
                    capaciteStadeInput.value = data.capaciteStade || 0;
                    moisSaisonSelect.value = data.moisSaison || '0';
                    spectateursInput.value = data.spectateurs || 0;
                    sponsorsSelectionnes = data.sponsorsSelectionnes || [];
                    salaireTotalInput.value = data.salaireTotal || 0;
                    nombreStaffInput.value = data.nombreStaff || 0;
                    depensesTransfertsInput.value = data.depensesTransferts || 0;
                    nomJoueurTransfertInput.value = data.nomJoueurTransfert || '';
                    transactions = data.transactions || [];
                    clubInfosValidees = data.clubInfosValidees || false;
                    moisSaisonValide = data.moisSaisonValide || false;
                    revenuTotalSponsors = data.revenuTotalSponsors || 0;
                    totalEntretien = data.totalEntretien || 0;
                    droitsTvMontant = data.droitsTvMontant || 0;

                    // Remplir le résumé des transactions
                    resumeTransactionsList.innerHTML = '';
                    transactions.forEach(transaction => {
                        const li = document.createElement('li');
                        let signe = transaction.montant >= 0 ? '+' : '';
                        li.textContent = `${transaction.type}: ${signe}${transaction.montant} GP ${transaction.details}\n`;
                        resumeTransactionsList.appendChild(li);
                    });

                    afficherBudget();
                    initialiserSponsors();
                    // Mettre à jour l'interface en fonction du mois chargé
                    moisSaisonSelect.dispatchEvent(new Event('change'));
                    // Restaurer l'état des infos club
                    nomClubInput.disabled = clubInfosValidees;
                    budgetTotalActuelInput.disabled = clubInfosValidees;
                    nomStadeInput.disabled = clubInfosValidees;
                    capaciteStadeInput.disabled = clubInfosValidees;
                    validerInfosClubButton.disabled = clubInfosValidees ? true : false;
                    moisSaisonSelect.disabled = moisSaisonValide;
                    validerMoisSaisonButton.disabled = moisSaisonValide ? true : false;
                    if (moisSaisonValide) {
                         document.getElementById('mois-saison').classList.add('disabled');
                    }

                    // Restaurer les sponsors sélectionnés
                    sponsorsSelectionnes.forEach(sponsorNom => {
                        document.getElementById(`sponsor-${sponsorNom.toLowerCase()}-bloc`).classList.add('disabled');
                        document.getElementById(`sponsor-${sponsorNom.toLowerCase()}-bloc`).onclick = null;
                    });
                    signerSponsorsButton.disabled = sponsorsSelectionnes.length >= 2;
                    revenuSponsorsSpan.textContent = revenuTotalSponsors;

                    alert('Données chargées avec succès.');
                } catch (error) {
                    alert('Erreur lors du chargement du fichier.');
                    console.error('Erreur de chargement:', error);
                }
            };
            reader.readAsText(file);
        }
    });

    // Télécharger la facture du mois
    telechargerFactureButton.addEventListener('click', () => {
        const mois = moisSaisonSelect.value;
        const nomClubFacture = nomClub;
        const nomStade = nomStadeInput.value;
        const capaciteStade = capaciteStadeInput.value;

        let factureText = `Facture du mois de ${mois}\n\n`;
        factureText += `Club: ${nomClubFacture}\n`;
        factureText += `Stade: ${nomStade}\n`;
        factureText += `Capacité du stade: ${capaciteStade}\n\n`;
        factureText += "Résumé des transactions:\n";

        transactions.forEach(transaction => {
            let signe = transaction.montant >= 0 ? '+' : '';
            factureText += `${transaction.type}: ${signe}${transaction.montant} GP ${transaction.details}\n`;
        });

        factureText += `\nBudget Total: ${budget} GP`;

        const blob = new Blob([factureText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture_${mois}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Facture téléchargée.');
    });

    // Initialisations
    initialiserSponsors();
    afficherBudget();
    genererRevenuMerchandising();
    moisSaisonSelect.dispatchEvent(new Event('change')); // Pour initialiser l'état des boutons
});