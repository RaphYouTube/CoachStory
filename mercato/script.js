function updateBudgetDisplay() {
    const initialBudget = parseInt(initialBudgetInput.value) || 0;
    document.getElementById('initial-budget-display').textContent = initialBudget.toLocaleString();
    document.getElementById('budget-display').textContent = currentBudget.toLocaleString();
}

const userClubInput = document.getElementById('user-club-input');
const userClubSuggestions = document.getElementById('user-club-suggestions');
const userTeamDiv = document.getElementById('user-team');
const userTeamPlayersDiv = document.getElementById('user-team-players');
const offerSummaryDiv = document.getElementById('offer-summary');
const offerSummaryContentDiv = document.getElementById('offer-summary-content');
const offerSummaryAcceptedDiv = document.getElementById('offer-summary-accepted');
const offerSummaryRefusedDiv = document.getElementById('offer-summary-refused');
const initialBudgetInput = document.getElementById('initial-budget');
const currentBudgetDiv = document.getElementById('current-budget');
const budgetDisplay = document.getElementById('budget-display');
const resultsDiv = document.getElementById('results');
const offerDetailsDiv = document.getElementById('offer-details');
const offerPlayerName = document.getElementById('offer-player-name');
const offerPlayerDetails = document.getElementById('offer-player-details');
const offerAmountInput = document.getElementById('offer-amount');
const salaryAmountInput = document.getElementById('salary-amount');
const counterOfferAmountInput = document.getElementById('counter-offer-amount');
const counterSalaryAmountInput = document.getElementById('counter-salary-amount');
const acceptCounterOfferBtn = document.getElementById('accept-counter-offer-btn');
const rejectCounterOfferBtn = document.getElementById('reject-counter-offer-btn');
const positionFilter = document.getElementById('position-filter');
const nationalityFilter = document.getElementById('nationality-filter');
const minAgeFilter = document.getElementById('min-age-filter');
const maxAgeFilter = document.getElementById('max-age-filter');
const minRatingFilter = document.getElementById('min-rating-filter');
const maxRatingFilter = document.getElementById('max-rating-filter');
const minPriceFilter = document.getElementById('min-price-filter');
const maxPriceFilter = document.getElementById('max-price-filter');
const applyFiltersButton = document.getElementById('apply-filters');
const validateUserSetupButton = document.getElementById('validate-user-setup');
const sendOfferButton = document.getElementById('send-offer-btn');

let selectedPlayer = null;
let counterOfferPrice = 0;
let counterOfferSalary = 0;
let currentBudget = 0;
const offerHistory = [];
const offerCounts = {};
const purchasedPlayers = new Set();
const MAX_OFFERS = 3;
let allClubs = [];

window.onload = function () {
    populateClubList();
    setupEventListeners();
    loadUserData();
    displayPlayers(playersData.slice(0, 10));
};

function populateClubList() {
    const clubs = [...new Set(playersData.map(player => player.team_name).filter(Boolean))];
    allClubs = clubs;
}

function displayUserTeam() {
    const selectedClub = userClubInput.value;
    if (selectedClub && allClubs.includes(selectedClub)) {
        userTeamDiv.style.display = 'block';
        const teamPlayers = playersData.filter(player => player.team_name === selectedClub);
        let playersListHTML = '<ul>';
        teamPlayers.forEach(player => {
            playersListHTML += `<li>${player.name} (${player.position})</li>`;
        });
        playersListHTML += '</ul>';
        userTeamPlayersDiv.innerHTML = playersListHTML;

        currentBudget = parseInt(initialBudgetInput.value);
        updateBudgetDisplay();
        document.getElementById('initial-budget-display').textContent = parseInt(initialBudgetInput.value).toLocaleString();
        saveUserData(); // Sauvegarder immédiatement après la validation
    } else {
        userTeamDiv.style.display = 'none';
    }
}

function displayPlayers(players) {
    resultsDiv.innerHTML = '';
    if (players.length === 0) {
        resultsDiv.innerHTML = '<p>Aucun joueur trouvé.</p>';
        return;
    }

    players.forEach(player => {
        const isPurchased = purchasedPlayers.has(player.name);
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card', 'cursor-pointer', 'bg-white', 'shadow-md', 'rounded-md', 'p-4');
        playerCard.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${player.name}${isPurchased ? ' ⭐' : ''}</h3>
            <h3 class="text-xl font-semibold mb-2">${player.name}</h3>
            <p>Position: ${player.position}</p>
            <p>Club: ${player.team_name || 'Libre'}</p>
            <p>Note: ${player.overall_rating}</p>
            <p>Prix: ${player['price (GP)']} GP</p>
        `;
        if (!isPurchased) {
            playerCard.addEventListener('click', () => showOfferDetails(player));
        } else {
            playerCard.classList.add('opacity-50', 'cursor-not-allowed');
        }
        resultsDiv.appendChild(playerCard);
    });
}

function showOfferDetails(player) {
    selectedPlayer = player;
    offerPlayerName.textContent = `Offre pour: ${player.name}`;
    offerPlayerDetails.innerHTML = `
        <p>Position: ${player.position}</p>
        <p>Club: ${player.team_name || 'Libre'}</p>
        <p>Note: ${player.overall_rating}</p>
        <p>Prix: ${player['price (GP)']} GP</p>
    `;
    offerAmountInput.value = player['price (GP)'];
    salaryAmountInput.value = player.first_salary;
    offerDetailsDiv.style.display = 'block';
    document.getElementById('counter-offer-details').style.display = 'none';
}

function sendOffer() {
    if (purchasedPlayers.has(selectedPlayer.name)) {
        Swal.fire({
            title: 'Transfert impossible',
            text: 'Ce joueur fait déjà partie de votre club.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
        offerDetailsDiv.style.display = 'none';
        return;
    }

    if (!selectedPlayer) return;

    const offerAmount = parseInt(offerAmountInput.value);
    const salaryAmount = parseInt(salaryAmountInput.value);

    if (isNaN(offerAmount) || isNaN(salaryAmount) || offerAmount <= 0 || salaryAmount <= 0) {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez entrer un montant d\'offre et un salaire valides.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (offerAmount > currentBudget) {
        Swal.fire({
            title: 'Fonds Insuffisants',
            text: 'Vous n\'avez pas assez d\'argent pour faire cette offre.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    offerCounts[selectedPlayer.name] = (offerCounts[selectedPlayer.name] || 0) + 1;
    if (offerCounts[selectedPlayer.name] > MAX_OFFERS) {
        Swal.fire({
            title: 'Limite d\'Offres Atteinte',
            text: `Vous avez atteint la limite de ${MAX_OFFERS} offres pour ce joueur.`,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        offerDetailsDiv.style.display = 'none';
        return;
    }

    const transferResult = simulateTransfer(selectedPlayer, offerAmount, salaryAmount);

    if (transferResult.can_transfer) {
        currentBudget -= offerAmount;
        updateBudgetDisplay();
        purchasedPlayers.add(selectedPlayer.name);
        document.getElementById('initial-budget-display').textContent = parseInt(initialBudgetInput.value).toLocaleString();
        offerHistory.push({
            playerName: selectedPlayer.name,
            status: 'Acceptée',
            amount: offerAmount,
            salary: salaryAmount
        });
        updateOfferSummary(selectedPlayer.name, true);
        Swal.fire({
            title: 'Transfert Réussi',
            text: `Le transfert de ${selectedPlayer.name} a été accept\u00e9!`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
        offerDetailsDiv.style.display = 'none';
        displayUserTeam();
        displayPlayers(playersData.slice(0, 10));
        saveUserData();

    } else if (transferResult.counterOfferPrice && transferResult.counterOfferSalary) {
        counterOfferPrice = transferResult.counterOfferPrice;
        counterOfferSalary = transferResult.counterOfferSalary;
        counterOfferAmountInput.value = transferResult.counterOfferPrice;
        counterSalaryAmountInput.value = transferResult.counterOfferSalary;
        document.getElementById('counter-offer-details').style.display = 'block';
        offerDetailsDiv.style.display = 'none';
        Swal.fire({
            title: 'Négociation',
            text: transferResult.reason,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    } else {
        updateOfferSummary(selectedPlayer.name, false);
        Swal.fire({
            title: 'Transfert Refusé',
            text: transferResult.reason,
            icon: 'error',
            confirmButtonText: 'OK'
        });
        offerDetailsDiv.style.display = 'none';
    }
}

function acceptCounterOffer() {
    currentBudget -= counterOfferPrice;
    updateBudgetDisplay();
        document.getElementById('initial-budget-display').textContent = parseInt(initialBudgetInput.value).toLocaleString();
    offerHistory.push({
        playerName: selectedPlayer.name,
        status: 'Acceptée',
        amount: counterOfferPrice,
        salary: parseInt(counterSalaryAmountInput.value)
    });
    updateOfferSummary(selectedPlayer.name, true);
    Swal.fire({
        title: 'Transfert Réussi',
        text: `La contre-offre pour ${selectedPlayer.name} a été acceptée!`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
    document.getElementById('counter-offer-details').style.display = 'none';
    displayUserTeam();
    displayPlayers(playersData.slice(0, 10));
    saveUserData();
}

function rejectCounterOffer() {
    Swal.fire({
        title: 'Contre-Offre Refusée',
        text: `Vous avez refusé la contre-offre pour ${selectedPlayer.name}.`,
        icon: 'info',
        confirmButtonText: 'OK'
    });
    document.getElementById('counter-offer-details').style.display = 'none';
    offerDetailsDiv.style.display = 'none';
    updateOfferSummary(selectedPlayer.name, false);
}

function simulateTransfer(player, offerAmount, salaryAmount) {
    const baseSuccessRate = 0.3;
    const ratingInfluence = (player.overall_rating - 60) / 40 * 0.2;
    const offerInfluence = Math.min((offerAmount / player['price (GP)'] - 1), 1) * 0.2;
    const salaryInfluence = Math.min((salaryAmount / player.first_salary - 1), 1) * 0.1;

    const successRate = Math.min(baseSuccessRate + ratingInfluence + offerInfluence + salaryInfluence, 0.95);
    const isAccepted = Math.random() < successRate;

    const failureResponses = [
        "Le club vendeur a refusé l'offre.",
        "Le joueur n'est pas intéressé par le transfert.",
        "Les négociations salariales ont échoué.",
        "Le club vendeur exige un montant plus élevé.",
        "Le joueur a choisi un autre club."
    ];

    if (isAccepted) {
        return { can_transfer: true, reason: "Transfert réussi !" };
    } else if (Math.random() < 0.5) {
        const counterOfferPrice = Math.max(Math.round(player['price (GP)'] * (1.1 + Math.random() * 0.3)), offerAmount);
        const counterOfferSalary = Math.max(Math.round((player.first_salary || 0) * (1.1 + Math.random() * 0.3)), salaryAmount);
        return {
            can_transfer: false,
            reason: `Le club souhaite négocier. Notre contre-proposition est de ${counterOfferPrice} GP et ${counterOfferSalary} en salaire.`,
            counterOfferPrice: counterOfferPrice,
            counterOfferSalary: counterOfferSalary
        };
    } else {
        const randomIndex = Math.floor(Math.random() * failureResponses.length);
        return { can_transfer: false, reason: failureResponses[randomIndex] };
    }
}

function resetOfferCount(playerName) {
    delete offerCounts[playerName];
}

function updateOfferSummary(playerName, isAccepted) {
    const status = isAccepted ? 'Acceptée' : 'Refusée';
    const message = `${playerName}: Offre ${status}`;
    const offerElement = document.createElement('p');
    offerElement.textContent = message;
    if (isAccepted) {
        offerSummaryAcceptedDiv.appendChild(offerElement);
    } else {
        offerSummaryRefusedDiv.appendChild(offerElement);
    }
}

function saveUserData() {
    const userData = {
        team: userClubInput.value,
        budget: currentBudget,
        offerHistory: offerHistory
    };
    userData.purchasedPlayers = Array.from(purchasedPlayers);
    localStorage.setItem('user-data', JSON.stringify(userData));
}

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('user-data'));
    if (userData) {
        userClubInput.value = userData.team;
        initialBudgetInput.value = userData.budget;
        currentBudget = userData.budget;
        offerHistory.push(...userData.offerHistory);
        displayUserTeam();
    }
}

function setupEventListeners() {
    if (validateUserSetupButton) {
        validateUserSetupButton.addEventListener('click', validateUserSetup);
    }
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }
    if (sendOfferButton) {
        sendOfferButton.addEventListener('click', sendOffer);
    }
    if (acceptCounterOfferBtn) {
        acceptCounterOfferBtn.addEventListener('click', acceptCounterOffer);
    }
    if (rejectCounterOfferBtn) {
        rejectCounterOfferBtn.addEventListener('click', rejectCounterOffer);
    }

    userClubInput.addEventListener('input', showClubSuggestions);
    userClubInput.addEventListener('click', showClubSuggestions);
    userClubSuggestions.addEventListener('click', selectClubSuggestion);
    document.addEventListener('click', function(event) {
        if (!userClubInput.contains(event.target) && !userClubSuggestions.contains(event.target)) {
            userClubSuggestions.style.display = 'none';
        }
    });
}

function validateUserSetup() {
    if (userClubInput.value && initialBudgetInput.value) {
        displayUserTeam();
    } else {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez sélectionner un club et entrer un budget.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function applyFilters() {
    const filteredPlayers = playersData.filter(player => {
        if (positionFilter.value && player.position !== positionFilter.value) {
            return false;
        }
        if (nationalityFilter.value && !player.nationality_name.toLowerCase().includes(nationalityFilter.value.toLowerCase())) {
            return false;
        }
        const minAge = parseInt(minAgeFilter.value) || 0;
        const maxAge = parseInt(maxAgeFilter.value) || Infinity;
        if (player.age < minAge || player.age > maxAge) {
            return false;
        }
        const minRating = parseInt(minRatingFilter.value) || 0;
        const maxRating = parseInt(maxRatingFilter.value) || Infinity;
        if (player.overall_rating < minRating || player.overall_rating > maxRating) {
            return false;
        }
        const minPrice = parseInt(minPriceFilter.value) || 0;
        const maxPrice = parseInt(maxPriceFilter.value) || Infinity;
        if (player['price (GP)'] < minPrice || player['price (GP)'] > maxPrice) {
            return false;
        }
        return true;
    });
    displayPlayers(filteredPlayers);
}

function showClubSuggestions() {
    const inputValue = userClubInput.value.toLowerCase();
    const suggestions = allClubs.filter(club => club.toLowerCase().startsWith(inputValue));
    displayClubSuggestions(suggestions);
}

function displayClubSuggestions(suggestions) {
    userClubSuggestions.innerHTML = '';
    if (suggestions.length > 0) {
        suggestions.forEach(club => {
            const suggestion = document.createElement('div');
            suggestion.textContent = club;
            suggestion.classList.add('p-2', 'hover:bg-gray-100', 'cursor-pointer');
            suggestion.addEventListener('click', () => selectClubSuggestion(club));
            userClubSuggestions.appendChild(suggestion);
        });
        userClubSuggestions.style.display = 'block';
    } else {
        userClubSuggestions.style.display = 'none';
    }
}

function selectClubSuggestion(event) { // Change ici
    const clubName = event.target.textContent; // Change ici
    userClubInput.value = clubName;
    userClubSuggestions.style.display = 'none';
}
document.getElementById("update-budget-btn").addEventListener("click", () => {
    const spent = parseInt(document.getElementById("manual-budget-input").value);
    if (!isNaN(spent) && spent > 0 && spent <= currentBudget) {
        currentBudget -= spent;
        updateBudgetDisplay();
        saveUserData();
        Swal.fire({
            title: "Budget mis à jour",
            text: `Nouveau budget : ${currentBudget.toLocaleString()} GP`,
            icon: "success",
            confirmButtonText: "OK"
        });
    } else {
        Swal.fire({
            title: "Erreur",
            text: "Veuillez entrer une valeur valide inférieure ou égale à votre budget actuel.",
            icon: "error",
            confirmButtonText: "OK"
        });
    }
});
