export function generateSchoolYear() {
    // Returns the current school year in the format "YYYY-YYYY+1"
    const now = new Date();
    let startYear, endYear;
    // Assume school year starts in June
    if (now.getMonth() + 1 >= 6) {
        startYear = now.getFullYear();
        endYear = startYear + 1;
    } else {
        endYear = now.getFullYear();
        startYear = endYear - 1;
    }
    return `${startYear}-${endYear}`;
}

export function generateSemester() {
    // Returns the current semester as "1st Semester", "2nd Semester", or "Summer"
    const now = new Date();
    const month = now.getMonth() + 1; // JS months are 0-based

    // Typical PH university calendar:
    // 1st Semester: June - October
    // 2nd Semester: November - March
    // Summer: April - May
    if (month >= 8 && month <= 12) {
        return "1st Semester";
    } else if (month >= 1 && month <= 5) {
        return "2nd Semester";
    } else {
        return "Summer";
    }
}