document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const predictButton = document.getElementById('predict-button');
    const resetButton = document.getElementById('reset-button');
    const resultsContent = document.getElementById('results-content');
    
    // Blood type genetics data
    const bloodTypeAlleles = {
        'A+': { abo: ['A', 'A', 'O'], rh: ['+', '-'] },
        'A-': { abo: ['A', 'A', 'O'], rh: ['-'] },
        'B+': { abo: ['B', 'B', 'O'], rh: ['+', '-'] },
        'B-': { abo: ['B', 'B', 'O'], rh: ['-'] },
        'AB+': { abo: ['A', 'B'], rh: ['+', '-'] },
        'AB-': { abo: ['A', 'B'], rh: ['-'] },
        'O+': { abo: ['O'], rh: ['+', '-'] },
        'O-': { abo: ['O'], rh: ['-'] }
    };
    
    // Blood type inheritance compatibility matrix
    const bloodTypeCompatibility = {
        'A': {
            'A': ['A', 'O'],
            'B': ['AB', 'A', 'B', 'O'],
            'AB': ['A', 'B', 'AB'],
            'O': ['A', 'O']
        },
        'B': {
            'A': ['AB', 'A', 'B', 'O'],
            'B': ['B', 'O'],
            'AB': ['A', 'B', 'AB'],
            'O': ['B', 'O']
        },
        'AB': {
            'A': ['A', 'AB', 'B'],
            'B': ['A', 'AB', 'B'],
            'AB': ['A', 'B', 'AB'],
            'O': ['A', 'B']
        },
        'O': {
            'A': ['A', 'O'],
            'B': ['B', 'O'],
            'AB': ['A', 'B'],
            'O': ['O']
        }
    };
    
    // Rhesus factor inheritance
    function getPossibleRhFactors(parent1Rh, parent2Rh) {
        // If both parents are Rh negative, child can only be Rh negative
        if (parent1Rh.length === 1 && parent2Rh.length === 1 && parent1Rh[0] === '-' && parent2Rh[0] === '-') {
            return ['-'];
        }
        
        // If at least one parent has Rh positive and can pass it, both + and - are possible
        if ((parent1Rh.includes('+') || parent2Rh.includes('+'))) {
            return ['+', '-'];
        }
        
        return ['-']; // Default to negative if uncertain
    }
    
    // Function to predict possible blood groups
    function predictBloodGroups(fatherBlood, motherBlood, paternalGF, paternalGM, maternalGF, maternalGM) {
        let possibleABO = [];
        let fatherABO, motherABO;
        
        // Extract ABO blood type (without Rh)
        fatherABO = fatherBlood.replace('+', '').replace('-', '');
        motherABO = motherBlood.replace('+', '').replace('-', '');
        
        // Extract Rh factor
        const fatherRh = bloodTypeAlleles[fatherBlood].rh;
        const motherRh = bloodTypeAlleles[motherBlood].rh;
        
        // Get possible ABO combinations
        possibleABO = bloodTypeCompatibility[fatherABO][motherABO];
        
        // Get possible Rh factors
        const possibleRh = getPossibleRhFactors(fatherRh, motherRh);
        
        // Combine ABO and Rh to get all possible blood groups
        const possibleGroups = [];
        possibleABO.forEach(abo => {
            possibleRh.forEach(rh => {
                possibleGroups.push(abo + rh);
            });
        });
        
        // Refine prediction if grandparents' information is available
        // This would be a more complex genetic algorithm in a real application
        // Here we'll just use a simplified approach for demonstration
        
        return possibleGroups;
    }
    
    // Event listener for Predict button
    predictButton.addEventListener('click', function() {
        const fatherBlood = document.getElementById('father-blood').value;
        const motherBlood = document.getElementById('mother-blood').value;
        const paternalGF = document.getElementById('paternal-gf-blood').value;
        const paternalGM = document.getElementById('paternal-gm-blood').value;
        const maternalGF = document.getElementById('maternal-gf-blood').value;
        const maternalGM = document.getElementById('maternal-gm-blood').value;
        
        // Validate required fields
        if (!fatherBlood || !motherBlood) {
            resultsContent.innerHTML = '<p class="no-results">Please select both parents\' blood groups to get a prediction.</p>';
            return;
        }
        
        // Get predicted blood groups
        const possibleGroups = predictBloodGroups(
            fatherBlood, 
            motherBlood, 
            paternalGF, 
            paternalGM, 
            maternalGF, 
            maternalGM
        );
        
        // Display results
        if (possibleGroups.length > 0) {
            let resultHTML = `
                <p>Based on the parents' blood groups (Father: <span class="highlight">${fatherBlood}</span>, 
                Mother: <span class="highlight">${motherBlood}</span>), the baby could have the following blood groups:</p>
                <div class="possible-groups">
            `;
            
            possibleGroups.forEach(group => {
                resultHTML += `<span class="blood-group">${group}</span>`;
            });
            
            resultHTML += '</div>';
            resultHTML += '<p class="highlight">POSSIBLE BLOOD GROUPS: ' + possibleGroups.join(', ') + '</p>';
            
            // Add WHO regional distribution data
            resultHTML += `
                <div class="distribution-info">
                    <p><strong>Note:</strong> Blood type distribution varies by region according to WHO data:</p>
                    <ul>
                        <li>Type O is most common globally (around 40-45%)</li>
                        <li>Type A is more common in Western Europe and North America (30-35%)</li>
                        <li>Type B is more common in Asia (20-30%)</li>
                        <li>Type AB is the rarest type globally (2-5%)</li>
                        <li>Rh-negative is rare in Asian and African populations (less than 1%) but more common in Western populations (15-17%)</li>
                    </ul>
                </div>
            `;
            
            resultsContent.innerHTML = resultHTML;
        } else {
            resultsContent.innerHTML = '<p class="no-results">No possible blood groups could be determined. Please check your input.</p>';
        }
    });
    
    // Event listener for Reset button
    resetButton.addEventListener('click', function() {
        document.getElementById('father-blood').value = '';
        document.getElementById('mother-blood').value = '';
        document.getElementById('paternal-gf-blood').value = '';
        document.getElementById('paternal-gm-blood').value = '';
        document.getElementById('maternal-gf-blood').value = '';
        document.getElementById('maternal-gm-blood').value = '';
        
        resultsContent.innerHTML = '<p>Please enter parents\' blood groups and click "Predict" to see possible blood groups for the baby.</p>';
    });
});
