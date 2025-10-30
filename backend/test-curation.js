const { NewsAgent } = require('./src/agents/curationAgents');
const logger = require('./src/lib/logger');

async function testNewsCuration() {
    try {
        console.log('Testing news curation agent...');

        const newsAgent = new NewsAgent();

        // Test searching for real news (should fall back to mock articles)
        const articles = await newsAgent.searchRealNewsArticles('cooking', ['recipes', 'techniques'], 2);

        console.log('Generated articles:');
        console.log(JSON.stringify(articles, null, 2));

        console.log('\nTest completed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run test
testNewsCuration();