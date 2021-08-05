// Hand the processed sections to the DB
async function fillSections(processedData) {
  for (let section of processedData) {
    const dbSection = await SectionsModel.findOne({ id: section.id })
    if (!dbSection) {
      dbSection = new SectionsModel(section)
      console.log(`Adding new section ID: ${section.id}`)
    } else { // Modify the old existing section
      console.log(`Updating existing section ID: ${section.id}`)
      for (let property in section) {
        dbSection[property] = section[property]
      }
    }
    const dbResponse = await dbSection.save()
    console.log("DB RESPONSE START")
    console.log(dbResponse)
    console.log("DB RESPONSE END\n")
  }

  return true
}