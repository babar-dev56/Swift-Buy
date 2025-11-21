// AI Product Condition Detection System
// Simulates AI analysis of product images/videos for return approval

class AIReturnDetection {
    constructor() {
        this.conditions = ['excellent', 'good', 'fair', 'poor'];
    }

    // Analyze product condition from uploaded files
    async analyzeCondition(files) {
        // Simulate AI processing time
        await this.delay(2000);

        // Analyze each file
        const analyses = [];
        for (const file of files) {
            const analysis = await this.analyzeFile(file);
            analyses.push(analysis);
        }

        // Aggregate results
        const overallCondition = this.aggregateConditions(analyses);
        const details = this.generateDetails(overallCondition, analyses);
        const confidence = this.calculateConfidence(analyses);

        return {
            condition: overallCondition,
            details: details,
            confidence: confidence,
            analyses: analyses
        };
    }

    // Analyze individual file
    async analyzeFile(file) {
        // Simulate AI image/video analysis
        // In a real system, this would call an AI API (e.g., TensorFlow.js, Cloud Vision API, etc.)
        
        const isVideo = file.type.startsWith('video/');
        const fileSize = file.size;
        
        // Simulate condition detection based on file characteristics
        // In reality, this would use computer vision to detect:
        // - Scratches, dents, damage
        // - Wear and tear
        // - Packaging condition
        // - Product completeness
        
        const randomCondition = this.conditions[Math.floor(Math.random() * this.conditions.length)];
        
        // Simulate more realistic conditions (bias towards better conditions for demo)
        const conditionWeights = {
            'excellent': 0.3,  // 30% chance
            'good': 0.4,       // 40% chance
            'fair': 0.2,       // 20% chance
            'poor': 0.1        // 10% chance
        };
        
        const condition = this.weightedRandom(conditionWeights);
        
        return {
            filename: file.name,
            type: isVideo ? 'video' : 'image',
            condition: condition,
            detectedIssues: this.generateIssues(condition),
            timestamp: Date.now()
        };
    }

    // Weighted random selection
    weightedRandom(weights) {
        const random = Math.random();
        let sum = 0;
        
        for (const [condition, weight] of Object.entries(weights)) {
            sum += weight;
            if (random <= sum) {
                return condition;
            }
        }
        
        return 'good'; // fallback
    }

    // Generate detected issues based on condition
    generateIssues(condition) {
        const issueTemplates = {
            'excellent': [
                'No visible damage detected',
                'Product appears in original condition',
                'Packaging intact'
            ],
            'good': [
                'Minor wear visible',
                'Small scratches detected',
                'Overall good condition'
            ],
            'fair': [
                'Moderate wear detected',
                'Some scratches and scuffs visible',
                'Packaging may be damaged'
            ],
            'poor': [
                'Significant damage detected',
                'Multiple scratches and dents',
                'Product condition below acceptable standards'
            ]
        };

        return issueTemplates[condition] || issueTemplates['good'];
    }

    // Aggregate conditions from multiple files
    aggregateConditions(analyses) {
        // Count conditions
        const conditionCounts = {};
        analyses.forEach(analysis => {
            conditionCounts[analysis.condition] = (conditionCounts[analysis.condition] || 0) + 1;
        });

        // Find most common condition
        let maxCount = 0;
        let overallCondition = 'good';
        
        for (const [condition, count] of Object.entries(conditionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                overallCondition = condition;
            }
        }

        // If poor condition detected in any image, overall is poor
        if (analyses.some(a => a.condition === 'poor')) {
            return 'poor';
        }

        // If fair condition detected in multiple images, overall is fair
        if (analyses.filter(a => a.condition === 'fair').length >= 2) {
            return 'fair';
        }

        return overallCondition;
    }

    // Generate detailed analysis report
    generateDetails(condition, analyses) {
        const details = [];
        
        details.push(`Analyzed ${analyses.length} file(s)`);
        
        const conditionCounts = {};
        analyses.forEach(a => {
            conditionCounts[a.condition] = (conditionCounts[a.condition] || 0) + 1;
        });
        
        for (const [cond, count] of Object.entries(conditionCounts)) {
            details.push(`${count} file(s) detected as ${cond} condition`);
        }

        // Add specific issues
        analyses.forEach(analysis => {
            if (analysis.detectedIssues.length > 0) {
                details.push(`In ${analysis.filename}: ${analysis.detectedIssues[0]}`);
            }
        });

        return details;
    }

    // Calculate confidence score
    calculateConfidence(analyses) {
        // More files = higher confidence
        const baseConfidence = Math.min(95, 70 + (analyses.length * 5));
        
        // Agreement between analyses increases confidence
        const conditions = analyses.map(a => a.condition);
        const uniqueConditions = new Set(conditions).size;
        const agreementBonus = uniqueConditions === 1 ? 10 : 0;
        
        return Math.min(99, baseConfidence + agreementBonus);
    }

    // Determine if return should be auto-approved
    shouldAutoApprove(condition, confidence) {
        // Auto-approve if:
        // 1. Condition is poor or fair (product has issues)
        // 2. Confidence is high enough (>= 75%)
        // 3. Or condition is excellent/good but user claims defect
        
        if (condition === 'poor' && confidence >= 75) {
            return { approved: true, reason: 'Product condition is poor. Refund approved automatically.' };
        }
        
        if (condition === 'fair' && confidence >= 80) {
            return { approved: true, reason: 'Product shows significant wear. Refund approved automatically.' };
        }
        
        if (condition === 'excellent' || condition === 'good') {
            return { 
                approved: false, 
                reason: 'Product appears in good condition. Manual review required.',
                requiresReview: true
            };
        }
        
        return { 
            approved: false, 
            reason: 'Unable to determine condition with sufficient confidence. Manual review required.',
            requiresReview: true
        };
    }

    // Delay helper
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global instance
const aiReturnDetection = new AIReturnDetection();
window.aiReturnDetection = aiReturnDetection;

// Analyze product condition (called from returns.html)
async function analyzeProductCondition(files) {
    try {
        const result = await aiReturnDetection.analyzeCondition(files);
        
        // Show analysis results
        if (typeof showAnalysisResults === 'function') {
            showAnalysisResults(result.condition, result.details, result.confidence);
        }
        
        return result;
    } catch (error) {
        console.error('AI Analysis Error:', error);
        alert('Error analyzing product condition. Please try again.');
    }
}

// Auto-approve return based on condition
function autoApproveReturn(condition, confidence) {
    const approvalStatus = document.getElementById('approvalStatus');
    const approvalIcon = document.getElementById('approvalIcon');
    const approvalMessage = document.getElementById('approvalMessage');
    const approvalDetails = document.getElementById('approvalDetails');
    const submitBtn = document.getElementById('submitBtn');
    
    const decision = aiReturnDetection.shouldAutoApprove(condition, confidence);
    
    approvalStatus.classList.add('active');
    approvalStatus.classList.remove('approved', 'pending', 'rejected');
    
    if (decision.approved) {
        // Auto-approved
        approvalStatus.classList.add('approved');
        approvalIcon.textContent = '✅';
        approvalMessage.textContent = 'Refund Auto-Approved!';
        approvalDetails.innerHTML = `
            <p>${decision.reason}</p>
            <p style="margin-top: 10px; font-size: 0.9em;">Your refund will be processed within 3-5 business days.</p>
            <p style="margin-top: 10px; font-size: 0.9em;">Return shipping label will be sent to your email.</p>
        `;
        submitBtn.textContent = 'Return Approved ✓';
        submitBtn.disabled = true;
        submitBtn.style.background = '#4caf50';
        
        // Save return request
        saveReturnRequest(decision);
        
        // Reload history
        if (typeof loadReturnHistory === 'function') {
            setTimeout(loadReturnHistory, 500);
        }
    } else {
        // Requires manual review
        approvalStatus.classList.add('pending');
        approvalIcon.textContent = '⏳';
        approvalMessage.textContent = 'Manual Review Required';
        approvalDetails.innerHTML = `
            <p>${decision.reason}</p>
            <p style="margin-top: 10px; font-size: 0.9em;">Our team will review your return request within 24-48 hours.</p>
            <p style="margin-top: 10px; font-size: 0.9em;">You will receive an email notification once reviewed.</p>
        `;
        submitBtn.textContent = 'Request Submitted - Under Review';
        submitBtn.disabled = true;
        submitBtn.style.background = '#ff9800';
        
        // Save return request
        saveReturnRequest(decision);
        
        // Reload history
        if (typeof loadReturnHistory === 'function') {
            setTimeout(loadReturnHistory, 500);
        }
    }
}

// Save return request to localStorage
function saveReturnRequest(decision) {
    const orderNumber = document.getElementById('orderNumber').value;
    const productName = document.getElementById('productName').value;
    const returnReason = document.getElementById('returnReason').value;
    const description = document.getElementById('description').value;
    
    // Get condition from analysis if available
    const conditionBadge = document.getElementById('conditionBadge');
    const condition = conditionBadge ? conditionBadge.textContent.toLowerCase() : 'unknown';
    
    const returnRequest = {
        id: Date.now(),
        orderNumber: orderNumber,
        productName: productName,
        returnReason: returnReason,
        description: description,
        condition: condition,
        status: decision.approved ? 'approved' : 'pending',
        timestamp: Date.now(),
        decision: decision,
        filesCount: window.uploadedFiles ? window.uploadedFiles.length : 0
    };
    
    // Get existing returns
    const returns = JSON.parse(localStorage.getItem('swiftbuy_returns') || '[]');
    returns.push(returnRequest);
    localStorage.setItem('swiftbuy_returns', JSON.stringify(returns));
    
    console.log('Return request saved:', returnRequest);
    
    // Show success message
    if (decision.approved) {
        setTimeout(() => {
            alert('✅ Return request approved! Your refund will be processed within 3-5 business days.');
        }, 500);
    } else {
        setTimeout(() => {
            alert('📋 Return request submitted! Our team will review it within 24-48 hours.');
        }, 500);
    }
}

