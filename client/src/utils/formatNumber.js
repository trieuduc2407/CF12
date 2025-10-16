const formatNumber = (x) => {
    if (x === undefined || x === null) return '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export default formatNumber;