export const marpTheme = "./themes/card-theme.css";

export const slideDefaults = {
  theme: marpTheme,
  layout: "card",
  size: "16:9",
  fontFamily: "sans-serif",
  paginate: true
};

export const layoutTokens = {
  cardClass: "<!-- _class: card -->",
  titleSlide: "# {title}\n\n### {subtitle}\n*{company}*",
  agendaSlide: "## Agenda\n\n- Market Maturity\n- Buyer Traits\n- Pricing Models\n- Sales Process",
  closingSlide: "## Ready to sell smarter?\n\n**Contact:** {email}"
};
