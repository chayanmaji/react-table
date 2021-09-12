import Data from './Data.json';

export const countries = () => {
    let list = [];

    Data.forEach(element => {
        const condition = (e) => e === element.country;

        if (list.findIndex(condition)===-1)
        {
            list.push(element.country);
        }
    })

    return list.sort();
}