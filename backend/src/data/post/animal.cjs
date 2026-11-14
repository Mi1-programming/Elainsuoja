
/**
 * Calculate an age from a birthday
 * SOURCE: https://stackoverflow.com/a/24181701
 * @param {Date} birthday 
 * @returns 
 */
function CalculateAge(birthday) {
    var ageDifferenceInMilliseconds = Date.now() - birthday;
    var ageDate = new Date(ageDifferenceInMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
 }

/**
 * An animal in the shelter after processing
 * @typedef {Object} Animal
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} category_text_id
 * @property {string} breed
 * @property {string} born_date
 * @property {string} shelter_date
 * @property {string} image_url
 * @property {string} status
 * @property {number} age
 */

/**
 * 
 * @param {import("#src/db/animals.cjs").RawAnimal[]} rawAnimals
 * @returns {Animal[]}
 */
function PostProcessAnimals(rawAnimals) {
    const animals = []
    rawAnimals.forEach((rawAnimal) => {
        const animal = {...rawAnimal}
        const birthday = new Date(rawAnimal.born_date)
        animal.age = CalculateAge(birthday)
        animals.push(animal)
    })
    return animals
}

module.exports = {
    PostProcessAnimals
}