// Buat Kalkulator
// Storage untuk history
let calculationHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];

// Fungsi faktorial
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Fungsi permutasi biasa P(n,r)
function permutation(n, r) {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
}

// Fungsi kombinasi biasa C(n,r)
function combination(n, r) {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
}

// Fungsi permutasi dengan unsur sama
function permutationWithSameElements(n, sameElements) {
    let denominator = 1;
    sameElements.forEach(element => {
        denominator *= factorial(element);
    });
    return factorial(n) / denominator;
}

// Fungsi permutasi siklis
function circularPermutation(n) {
    return factorial(n - 1);
}

// Fungsi kombinasi dengan pengulangan
function combinationWithRepetition(n, r) {
    return combination(n + r - 1, r);
}

// Update formula display berdasarkan pilihan
document.getElementById('calculationType').addEventListener('change', function() {
    updateFormulaDisplay();
    toggleSameElementsInput();
});

function toggleSameElementsInput() {
    const sameElementsDiv = document.getElementById('sameElementsInput');
    const calculationType = document.getElementById('calculationType').value;
    
    if (calculationType === 'permutation_same') {
        sameElementsDiv.style.display = 'block';
    } else {
        sameElementsDiv.style.display = 'none';
    }
}

function updateFormulaDisplay() {
    const type = document.getElementById('calculationType').value;
    const formulaDiv = document.getElementById('formula');

    // Semua rumus utama pakai LaTeX
    const latexFormulas = {
        'permutation': '$$P(n, r) = \\frac{n!}{(n-r)!}$$',
        'permutation_same': '$$P = \\frac{n!}{n_1! \\times n_2! \\times n_3! \\times \\ldots}$$',
        'circular': '$$P_{\\text{siklis}} = (n-1)!$$',
        'combination': '$$C(n, r) = \\frac{n!}{r!(n-r)!}$$',
        'binomial_coefficient': '$$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$',
        'combination_repeat': '$$C(n+r-1, r) = \\frac{(n+r-1)!}{r!(n-1)!}$$'
    };

    formulaDiv.innerHTML = latexFormulas[type] || '';
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([formulaDiv]);
    }
}

function calculate() {
    const n = parseInt(document.getElementById('n').value);
    const r = parseInt(document.getElementById('r').value);
    const type = document.getElementById('calculationType').value;

    if (isNaN(n) || n < 0) {
        showError('Masukkan nilai n yang valid (bilangan bulat non-negatif)');
        return;
    }

    let result, explanation;

    try {
        switch(type) {
            case 'permutation':
                if (isNaN(r) || r < 0 || r > n) throw new Error('Nilai r harus lebih kecil atau sama dengan n');
                result = permutation(n, r);
                explanation = `$$P(${n},${r}) = \\frac{${n}!}{(${n}-${r})!} = ${result}$$`;
                break;

            case 'combination':
                if (isNaN(r) || r < 0 || r > n) throw new Error('Nilai r harus lebih kecil atau sama dengan n');
                result = combination(n, r);
                explanation = `$$C(${n},${r}) = \\frac{${n}!}{${r}!(${n}-${r})!} = ${result}$$`;
                break;

            case 'binomial_coefficient':
                if (isNaN(r) || r < 0 || r > n) throw new Error('Nilai k (r) harus lebih kecil atau sama dengan n');
                result = combination(n, r);
                explanation = `$$\\binom{${n}}{${r}} = \\frac{${n}!}{${r}!(${n}-${r})!} = ${result}$$`;
                break;

            case 'permutation_same':
                const sameElementsInput = document.getElementById('sameElements').value;
                const sameElements = sameElementsInput.split(',').map(num => parseInt(num.trim()));
                if (sameElements.some(isNaN)) throw new Error('Masukkan angka yang valid untuk unsur sama');
                const sumSame = sameElements.reduce((a, b) => a + b, 0);
                if (sumSame !== n) throw new Error(`Total unsur sama (${sumSame}) harus sama dengan n (${n})`);
                result = permutationWithSameElements(n, sameElements);
                explanation = `$$P = \\frac{${n}!}{${sameElements.map(x => x + '!').join(' \\times ')}} = ${result}$$`;
                break;

            case 'circular':
                if (n < 2) throw new Error('Nilai n harus lebih besar dari 1 untuk permutasi siklis');
                result = circularPermutation(n);
                explanation = `$$P_{\\text{siklis}} = (${n}-1)! = ${result}$$`;
                break;

            case 'combination_repeat':
                if (isNaN(r) || r < 0) throw new Error('Masukkan nilai r yang valid');
                result = combinationWithRepetition(n, r);
                explanation = `$$C(${n}+${r}-1, ${r}) = \\frac{(${n}+${r}-1)!}{${r}!(${n}-1)!} = ${result}$$`;
                break;
        }

        showResult(result, explanation);

        // Tambahkan ke history
        window.addToHistory(type, n, r, result, explanation);

    } catch (error) {
        showError(error.message);
    }
}

function showResult(result, explanation) {
    document.getElementById('result').innerHTML = `
        <div class="result-item">
            <p class="result-value">${result.toLocaleString()}</p>
            <p class="result-explanation">${explanation}</p>
        </div>
    `;
    // Render MathJax untuk penjelasan
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([document.getElementById('result')]);
    }
}

function showError(message) {
    document.getElementById('result').innerHTML = `
        <div class="result-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Pastikan addToHistory tersedia secara global
function addToHistory(type, n, r, result, explanation) {
    const historyItem = {
        type: type,
        n: n,
        r: r,
        result: result,
        explanation: explanation,
        timestamp: new Date().toLocaleString()
    };

    calculationHistory.unshift(historyItem);
    if (calculationHistory.length > 10) {
        calculationHistory = calculationHistory.slice(0, 10);
    }

    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
}
window.addToHistory = addToHistory;

function updateHistoryDisplay() {
    const historyDiv = document.getElementById('history');
    
    if (calculationHistory.length === 0) {
        historyDiv.innerHTML = '<p class="empty-history">Belum ada riwayat perhitungan</p>';
        return;
    }
    
    historyDiv.innerHTML = calculationHistory.map(item => `
        <div class="history-item">
            <strong>${getTypeName(item.type)}</strong> 
            <span>${item.r !== undefined ? `n=${item.n}, r=${item.r}` : `n=${item.n}`}</span>
            <div class="history-result">
                <small>Hasil: <strong>${item.result}</strong></small>
            </div>
            <small class="history-time">${item.timestamp}</small>
        </div>
    `).join('');
}
window.updateHistoryDisplay = updateHistoryDisplay;

function getTypeName(type) {
    const names = {
        'permutation': 'Permutasi Biasa',
        'permutation_same': 'Permutasi Unsur Sama',
        'circular': 'Permutasi Siklis',
        'combination': 'Kombinasi Biasa',
        'binomial_coefficient': 'Koefisien Binomial',
        'combination_repeat': 'Kombinasi Pengulangan'
    };
    return names[type] || type;
}

function clearHistory() {
    calculationHistory = [];
    localStorage.removeItem('calcHistory');
    updateHistoryDisplay();
}
window.clearHistory = clearHistory;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateFormulaDisplay();
    updateHistoryDisplay();
});