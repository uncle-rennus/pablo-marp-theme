const rules = [
  { from: /Advertising\/Banner\/Digital Marketing\/Paid Media or Search/g, to: 'Digital Marketing' },
  { from: /HYPERFLOW SOLUCOES TECNOLOGICAS LTDA/g, to: 'HYPERFLOW' },
  { from: /Approximately USD/g, to: 'USD' },
  { from: /considering conversion/g, to: 'conv.' },
  { from: /dollar to real conversion at/g, 'USD/BRL @' },
  { from: /Please use meta-hyperflow-submission\.xlsx for customers? data/g, to: 'See xlsx' },
  { from: /Matched Approved Campaign\(s\)/g, to: 'Matched Campaigns' },
  { from: /Total Amount Spent On Activity \(In USD\)/g, to: 'Total Spent' },
  { from: /WITHIN APPROVED BUDGET/g, to: 'WITHIN BUDGET' },
  { from: /EXCEEDS APPROVED BUDGET/g, to: 'EXCEEDS BUDGET' },
  { from: /Pending Partner Information/g, to: 'Pending Info' },
  { from: /H1 2025 Correct - /g, to: 'H1 2025 ' },
  { from: /H1 2025 Hyperflow: /g, to: 'H1 ' },
];

export function optimizeContent(markdown) {
  return rules.reduce((text, rule) => text.replace(rule.from, rule.to), markdown);
}
