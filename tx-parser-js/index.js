exports.process = (file, onReady, onComplete) => {
    const reader = new FileReader();
    reader.onload = event => {
        const lines = event.target.result.split(/\r\n|\n/);

        onReady();

        let errorCount = 0;
        let transactions = [];
        
        lines.forEach((line, i) => {
            // Skip the header and any empty lines
            if (i === 0 || line.length == 0) {
                return;
            }

            // Parse the line into usable data
            let parts = line.split(", ");

            // Parse failure, expected 4 items to be present on this line
            if (parts.length !== 4) {
                console.error(line);
                ++errorCount;
                return;
            }
            
            // Save the transaction for future use
            transactions.push({
                name: parts[1],
                minPrice: parseFloat(parts[2]),
                maxPrice: parseFloat(parts[3])
            });
        });

        // Tracks how often items occur in the data set
        let nameOccuranceMap = new Map();

        // Tracks the cheapest object
        let cheapValue = transactions[0].minPrice;
        let cheapName = transactions[0].name;

        // Tracks the most expensive object
        let expensiveValue = cheapValue;
        let expensiveName = cheapName;

        // Parse all transactions
        transactions.forEach(transaction => {
            if (nameOccuranceMap.has(transaction.name)) {
                let value = nameOccuranceMap.get(transaction.name);
                ++value;
                nameOccuranceMap.set(transaction.name, value);
            } else {
                nameOccuranceMap.set(transaction.name, 1);
            }

            if (transaction.minPrice < cheapValue) {
                cheapValue = transaction.minPrice;
                cheapName = transaction.name;
            } else if (transaction.maxPrice > expensiveValue) {
                expensiveValue = transaction.maxPrice;
                expensiveName = transaction.name;
            }
        });

        // Find the most frequent and least frequent occurances
        let mostFrequentCount = 0;
        let mostFrequentName = "";
        let leastFrequentCount = Number.MAX_SAFE_INTEGER;
        let leastFrequentName = "";

        nameOccuranceMap.forEach((value, key) => {
            if (leastFrequentCount > value) {
                leastFrequentCount = value;
                leastFrequentName = key;
            } else if (mostFrequentCount < value) {
                mostFrequentCount = value;
                mostFrequentName = key;
            }
        });
        
        const result = {
            transactionCount: transactions.length,
            errorCount: errorCount,
            failureRate: errorCount / transactions.length * 100.0,
            mostFrequentName: mostFrequentName,
            mostFreuqnetNameOccurances: mostFrequentCount,
            leastFrequentName: leastFrequentName,
            leastFrequentNameOccurances: leastFrequentCount,
            cheapName: cheapName,
            cheapPrice: cheapValue,
            expensiveName: expensiveName,
            expensivePrice: expensiveValue
        };

        onComplete(result);
    };

    reader.readAsText(file);
}
