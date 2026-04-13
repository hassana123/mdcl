const TITLE_PRIORITY = [
  "founder",
  "co-founder",
  "chairman",
  "chairperson",
  "ceo",
  "chief executive officer",
  "managing director",
  "executive director",
  "director",
  "principal consultant",
  "senior consultant",
  "consultant",
  "advisor",
  "associate",
];

export function getTeamTitleRank(title = "") {
  const normalizedTitle = title.trim().toLowerCase();
  const index = TITLE_PRIORITY.findIndex((entry) => normalizedTitle.includes(entry));
  return index === -1 ? TITLE_PRIORITY.length : index;
}

export function sortTeamMembersByHierarchy(teamMembers = []) {
  return [...teamMembers].sort((a, b) => {
    const rankDifference = getTeamTitleRank(a.title) - getTeamTitleRank(b.title);
    if (rankDifference !== 0) {
      return rankDifference;
    }

    const orderDifference = Number(a.order || 0) - Number(b.order || 0);
    if (orderDifference !== 0) {
      return orderDifference;
    }

    return (a.name || "").localeCompare(b.name || "");
  });
}
