import { bold, cyan, dim, gold, green, yellow, blue } from './colors.js';
import { pressEnter } from './prompts.js';

const pages = [
  {
    title: 'Home & Daily Verse',
    icon: '📖',
    body: [
      `When you open the app, you're greeted with a ${bold('daily featured verse')}`,
      `from the full KJV Bible (31,100 verses).`,
      ``,
      `Tap ${green('"Apply This Verse"')} to see AI-generated insights,`,
      `or browse the Quick Access topics below the verse.`,
      ``,
      `${dim('The app greets you by time of day — morning, afternoon, or evening.')} `
    ]
  },
  {
    title: 'Topic Collections',
    icon: '🏷️',
    body: [
      `Browse ${bold('14 curated topic collections')} that organize Scripture`,
      `by what you're going through in life:`,
      ``,
      `  ${gold('Faith')}  ·  ${gold('Love')}  ·  ${gold('Wisdom')}  ·  ${gold('Finances')}`,
      `  ${gold('Marriage')}  ·  ${gold('Anxiety')}  ·  ${gold('Health')}  ·  ${gold('Parenting')}`,
      `  ${gold('Work')}  ·  ${gold('Salvation')}  ·  ${gold('Forgiveness')}  ·  ${gold('Strength')}`,
      `  ${gold('Prayer')}  ·  ${gold('Peace')}`,
      ``,
      `Each topic contains hand-picked verses with relevance scores.`
    ]
  },
  {
    title: 'Full Bible Browser',
    icon: '📚',
    body: [
      `Read the ${bold('complete KJV Bible')} — all 66 books, Old and New Testament.`,
      ``,
      `Navigate by book and chapter with clean, readable typography.`,
      `Tap any verse to see its detail page with AI insights.`,
      ``,
      `${dim('31,100 verses stored locally — no internet needed to read.')}`
    ]
  },
  {
    title: 'Search',
    icon: '🔍',
    body: [
      `${bold('Keyword Search:')} Find any word or phrase across all verses.`,
      `  Example: search ${cyan('"peace"')} to find every verse about peace.`,
      ``,
      `${bold('AI Search:')} Toggle the AI switch to ask natural questions.`,
      `  Example: ${cyan('"What does the Bible say about fear of failure?"')}`,
      `  The AI identifies relevant topics and finds matching verses`,
      `  across the full Bible.`
    ]
  },
  {
    title: 'AI-Powered Insights',
    icon: '✨',
    body: [
      `On any verse detail page, tap ${green('"AI Insight"')} for:`,
      ``,
      `  ${gold('Contextual Analysis')}  — Historical and theological context`,
      `  ${gold('Action Steps')}         — Easy, Medium, and Challenging levels`,
      `  ${gold('Reflection Questions')} — Personal, Relational, Spiritual, Practical`,
      `  ${gold('Word Study')}           — Original Hebrew & Greek with Strong's refs`,
      ``,
      `${dim('Requires an AI provider set up in Settings (see "Set up AI" option).')}`
    ]
  },
  {
    title: 'Journal & Notes',
    icon: '📝',
    body: [
      `${bold('Journal')} — Write reflections, prayers, and insights as you study.`,
      `  Attach verses, tag by mood, and build your spiritual journal.`,
      ``,
      `${bold('Notes')} — Add personal notes to any verse.`,
      ``,
      `${bold('Highlights')} — Color-code verses with multiple highlight colors.`,
      ``,
      `${dim('Everything is stored locally on your device — fully private.')}`
    ]
  },
  {
    title: 'Settings & Themes',
    icon: '⚙️',
    body: [
      `${bold('Theme:')} Choose Light, Dark, or System mode.`,
      ``,
      `${bold('Font Size:')} Small, Medium, Large, or Extra Large.`,
      ``,
      `${bold('AI Provider:')} Configure LM Studio, Ollama, OpenAI, or Claude`,
      `  with a one-click ${green('Test Connection')} button.`,
      ``,
      `${dim('Your API keys never leave your device.')}`
    ]
  }
];

export async function runTutorial() {
  console.log();
  console.log(`  ${bold(gold('Learn Bible Verse Hunter'))}`);
  console.log(`  ${dim(`${pages.length} features to explore — press Enter to advance`)}`);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    console.log();
    console.log(`  ${dim(`── ${i + 1}/${pages.length} ──────────────────────────────────────`)}`);
    console.log();
    console.log(`  ${page.icon}  ${bold(gold(page.title))}`);
    console.log();

    for (const line of page.body) {
      console.log(`  ${line}`);
    }

    console.log();

    if (i < pages.length - 1) {
      await pressEnter('Enter for next feature...');
    } else {
      await pressEnter();
    }
  }

  console.log();
  console.log(`  ${green(bold("That's everything!"))}`);
  console.log(`  ${dim('Download the app and start exploring Scripture today.')}`);
  console.log();
  await pressEnter();
}
