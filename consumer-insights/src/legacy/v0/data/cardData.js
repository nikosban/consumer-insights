export const cardData = {
  'Gender': {
    question: 'Gender - Are you... (single-pick)',
    base: 'n=60,235; all respondents',
    rows: [
      { label: 'Base', abs: '60,235', pop: '193.9m', pct: '100%', isBase: true },
      { label: 'Female', abs: '30,456 / 60,235', pop: '98.1m', pct: '51%' },
      { label: 'Male', abs: '29,779 / 60,235', pop: '95.9m', pct: '49%' },
    ],
    detailsTitle: 'GENDER (SINGLE PICK)',
    detailsDesc: 'Use this question to break down consumer preferences and purchasing patterns by gender, supporting inclusive marketing strategies and diversity-focused product development.',
    detailsNote: 'The original question and answer were introduced in 2019. This question is part of the Statista Survey, which covers all Consumer/Sector/market.',
  },
  'Age (basic)': {
    question: 'Age - How old are you? (single-pick)',
    base: 'n=60,235; all respondents',
    rows: [
      { label: 'Base', abs: '60,235', pop: '193.9m', pct: '100%', isBase: true },
      { label: '18-24', abs: '8,432 / 60,235', pop: '26.1m', pct: '14%' },
      { label: '25-34', abs: '12,651 / 60,235', pop: '40.8m', pct: '21%' },
      { label: '35-44', abs: '11,845 / 60,235', pop: '37.9m', pct: '20%' },
      { label: '45-54', abs: '11,243 / 60,235', pop: '36.0m', pct: '19%' },
      { label: '55-64', abs: '16,064 / 60,235', pop: '53.1m', pct: '27%' },
    ],
    detailsTitle: 'AGE (BASIC) (SINGLE PICK)',
    detailsDesc: 'Age is one of the most fundamental demographic variables for segmenting consumer audiences.',
    detailsNote: 'Introduced in 2016. Part of the core Statista Consumer Survey.',
  },
}

function hashStr(s) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33 ^ s.charCodeAt(i)) & 0x7fffffff
  return h
}

function seedInt(seed, min, max) {
  const next = (seed * 1664525 + 1013904223) & 0x7fffffff
  return { val: min + (next % (max - min + 1)), seed: next }
}

export function getColSplits(colCardName) {
  const data = getCardData(colCardName)
  const answers = data.rows.filter(r => !r.isBase).map(r => r.label)
  return [`Total — ${colCardName}`, ...answers]
}

export function getCrosstabCell(rowCardName, colCardName, split, answerLabel, isBase) {
  const splitSeed  = hashStr(`${rowCardName}|${colCardName}|${split}`)
  const answerSeed = hashStr(`${rowCardName}|${colCardName}|${split}|${answerLabel}`)

  const { val: splitN } = seedInt(splitSeed, 600, 5000)

  if (isBase) {
    const pop = (splitN / 60235 * 193.9).toFixed(1)
    return { abs: splitN.toLocaleString(), pop: `${pop}m`, pct: '100%' }
  }

  const { val: pct } = seedInt(answerSeed, 5, 95)
  const abs = Math.round(splitN * pct / 100)
  const pop = (abs / 60235 * 193.9).toFixed(1)
  return {
    abs: `${abs.toLocaleString()} / ${splitN.toLocaleString()}`,
    pop: `${pop}m`,
    pct: `${pct}%`,
  }
}

export function getCardData(name) {
  return cardData[name] || {
    question: `${name} - Survey question (single-pick)`,
    base: 'n=60,235; all respondents',
    rows: [
      { label: 'Base', abs: '60,235', pop: '193.9m', pct: '100%', isBase: true },
      { label: 'Yes', abs: '32,120 / 60,235', pop: '103.2m', pct: '53%' },
      { label: 'No', abs: '28,115 / 60,235', pop: '90.7m', pct: '47%' },
    ],
    detailsTitle: `${name.toUpperCase()} (SINGLE PICK)`,
    detailsDesc: `Survey question about ${name}.`,
    detailsNote: 'Part of the Statista Consumer Survey.',
  }
}
