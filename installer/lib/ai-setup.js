import { bold, cyan, dim, gold, green, yellow, blue, magenta } from './colors.js';
import { select, pressEnter, confirm } from './prompts.js';
import { openUrl } from './utils.js';

function box(lines) {
  console.log();
  for (const line of lines) {
    console.log(`  ${line}`);
  }
  console.log();
}

const providers = {
  lmstudio: {
    name: 'LM Studio',
    tag: 'Free · Local · Private',
    steps: [
      {
        title: 'Download LM Studio',
        body: `Go to ${cyan('https://lmstudio.ai')} and download for your OS.`,
        url: 'https://lmstudio.ai'
      },
      {
        title: 'Install a Bible-friendly model',
        body: `Open LM Studio, go to the ${bold('Search')} tab, and search for:\n  ${gold('TheBloke/Mistral-7B-Instruct-v0.2-GGUF')}\n  Download the ${bold('Q4_K_M')} version (good balance of speed and quality).`
      },
      {
        title: 'Start the local server',
        body: `Go to the ${bold('Local Server')} tab in LM Studio.\n  Load your downloaded model and click ${green('Start Server')}.`
      },
      {
        title: 'Configure the app',
        body: `Open Bible Verse Hunter and go to ${bold('Settings')}:\n  Provider: ${gold('LM Studio')}\n  URL: ${cyan('http://localhost:1234')}\n  Click ${green('Test Connection')} to verify.`
      }
    ]
  },

  ollama: {
    name: 'Ollama',
    tag: 'Free · Local · Private',
    steps: [
      {
        title: 'Install Ollama',
        body: `Go to ${cyan('https://ollama.ai')} and download the installer.`,
        url: 'https://ollama.ai'
      },
      {
        title: 'Download a model',
        body: `Open your terminal and run:\n  ${gold('ollama pull mistral')}\n  This downloads the Mistral model (~4GB, one-time download).`
      },
      {
        title: 'Configure the app',
        body: `Open Bible Verse Hunter and go to ${bold('Settings')}:\n  Provider: ${gold('LM Studio')}\n  URL: ${cyan('http://localhost:11434/v1')}\n  ${dim('(Ollama uses the same API format as LM Studio)')}\n  Click ${green('Test Connection')} to verify.`
      }
    ]
  },

  openai: {
    name: 'OpenAI',
    tag: 'Cloud · ~$0.01/insight · High quality',
    steps: [
      {
        title: 'Get an API key',
        body: `Go to ${cyan('https://platform.openai.com/api-keys')}\n  Create a new secret key and copy it.`,
        url: 'https://platform.openai.com/api-keys'
      },
      {
        title: 'Add billing (if needed)',
        body: `OpenAI requires a payment method on file.\n  Go to ${cyan('Settings > Billing')} in your OpenAI dashboard.\n  ${dim('Most Bible study usage costs less than $1/month.')} `
      },
      {
        title: 'Configure the app',
        body: `Open Bible Verse Hunter and go to ${bold('Settings')}:\n  Provider: ${gold('OpenAI')}\n  API Key: paste your ${dim('sk-...')} key\n  Model: ${cyan('gpt-4o-mini')} (recommended, ~$0.01/insight)\n     or: ${cyan('gpt-4o')} (best quality, ~$0.03/insight)\n  Click ${green('Test Connection')} to verify.`
      }
    ]
  },

  claude: {
    name: 'Claude',
    tag: 'Cloud · ~$0.01/insight · Thoughtful insights',
    steps: [
      {
        title: 'Get an API key',
        body: `Go to ${cyan('https://console.anthropic.com/')}\n  Create an account and generate an API key.`,
        url: 'https://console.anthropic.com/'
      },
      {
        title: 'Add billing',
        body: `Anthropic requires a payment method for API access.\n  Go to ${cyan('Settings > Billing')} in the console.\n  ${dim('Most Bible study usage costs less than $1/month.')} `
      },
      {
        title: 'Configure the app',
        body: `Open Bible Verse Hunter and go to ${bold('Settings')}:\n  Provider: ${gold('Claude')}\n  API Key: paste your ${dim('sk-ant-...')} key\n  Model: ${cyan('claude-3-haiku-20240307')} (fast, ~$0.01/insight)\n     or: ${cyan('claude-3-sonnet-20240229')} (deeper, ~$0.05/insight)\n  Click ${green('Test Connection')} to verify.`
      }
    ]
  }
};

export async function runAiSetup() {
  console.log();
  console.log(`  ${bold('Set Up AI Provider')}`);
  console.log();
  console.log(`  Bible Verse Hunter uses AI to generate:`);
  console.log(`  ${dim('·')} Verse insights and contextual analysis`);
  console.log(`  ${dim('·')} Personalized action steps`);
  console.log(`  ${dim('·')} Reflection questions`);
  console.log(`  ${dim('·')} Hebrew & Greek word studies`);
  console.log();
  console.log(`  ${bold('Compare providers:')}`);
  console.log();
  console.log(`  ${dim('Provider       Type     Cost          Best for')}`);
  console.log(`  ${dim('─'.repeat(55))}`);
  console.log(`  LM Studio    Local    ${green('Free')}          Privacy, offline use`);
  console.log(`  Ollama       Local    ${green('Free')}          Easy local setup`);
  console.log(`  OpenAI       Cloud    ~$0.01/use    Highest quality`);
  console.log(`  Claude       Cloud    ~$0.01/use    Thoughtful insights`);

  const choice = await select('Which provider would you like to set up?', [
    { label: `LM Studio  ${dim('— Free, runs on your computer')}`, value: 'lmstudio' },
    { label: `Ollama     ${dim('— Free, runs on your computer')}`, value: 'ollama' },
    { label: `OpenAI     ${dim('— Paid cloud API')}`, value: 'openai' },
    { label: `Claude     ${dim('— Paid cloud API')}`, value: 'claude' },
    { label: `${dim('Skip for now')}`, value: 'skip' }
  ]);

  if (choice === 'skip') {
    console.log();
    console.log(`  ${dim('No problem! You can set up AI later in the app Settings.')}`);
    console.log();
    await pressEnter();
    return;
  }

  const provider = providers[choice];
  console.log();
  console.log(`  ${bold(gold(`Setting up ${provider.name}`))}`);
  console.log(`  ${dim(provider.tag)}`);

  for (let i = 0; i < provider.steps.length; i++) {
    const step = provider.steps[i];
    console.log();
    console.log(`  ${gold(`Step ${i + 1}/${provider.steps.length}:`)} ${bold(step.title)}`);
    console.log();
    console.log(`  ${step.body}`);

    if (step.url) {
      console.log();
      if (await confirm(`  Open ${step.url} in your browser?`)) {
        await openUrl(step.url);
      }
    }

    console.log();
    await pressEnter(i < provider.steps.length - 1 ? 'Press Enter when ready for next step...' : 'Press Enter to finish...');
  }

  console.log();
  console.log(`  ${green(bold('AI setup complete!'))}`);
  console.log(`  Open the app, go to Settings, and click ${green('Test Connection')} to verify.`);
  console.log();
  await pressEnter();
}
