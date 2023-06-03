const swapElem = (array, index1, index2) => {
	var temp = array[index1];
	array[index1] = array[index2];
	array[index2] = temp;
};

function quickSort(array, minI, maxI) {
	const partition = (array, minI, maxI) => {
		var pivot = array[maxI];
		let i = minI - 1;
		for (let j = minI; j <= maxI - 1; j++) {
			const el = array[j];
			if (el < pivot) {
				i += 1;
				swapElem(array, i, j);
			}
		}
		swapElem(array, i + 1, maxI);
		return i + 1;
	};
	const startQuick = (array, minI, maxI) => {
		if (minI < maxI) {
			let partitionI = partition(array, minI, maxI);

			quickSort(array, minI, partitionI - 1);
			quickSort(array, partitionI + 1, maxI);
		}
	};
	startQuick(array, minI, maxI);
}

const randomColor = () => {
	let newColor = Math.floor(0xffffff * Math.random()).toString(16);
	var sizeDiff = 6 - newColor.length;
	var offset = "000000";
	var addOffset = offset.substring(0, sizeDiff);
	return "#" + newColor + addOffset;
};
// function prepare(speciesList, filter) {
// 	const listSet = [];
// 	let maxGenes = parseInt(filter.maxGenes);
// 	let startOffset = Math.floor(parseInt(filter.maxGenes)/2);
// 	let geneSelectedIndex = speciesList[parseInt(filter.SpeciesSelected)] ? speciesList[parseInt(filter.SpeciesSelected)].findIndex(elem => elem === filter.GeneSelected) : 0

// 	let startGene = parseInt(geneSelectedIndex) < maxGenes ? 0 : parseInt(geneSelectedIndex)-startOffset;
// 	console.log(`geneSelectedIndex :${geneSelectedIndex}`);

// 	for (let index = 0; index < speciesList.length; index++) {
// 		const ilement = speciesList[index];

// 		let temp = [];
// 		let jndex = startGene;

// 		while (temp.length < maxGenes+1) {
// 			temp.push(ilement[jndex]);
// 			jndex++;
// 		}

// 		listSet.push(temp);
// 	}

// 	return listSet;
// }


function prepare(speciesList, filter) {
	const listSet = [];
	let maxGenes = parseInt(filter.maxGenes);
	let startOffset = Math.floor(parseInt(filter.maxGenes)/2);

	let startGene = parseInt(filter.GeneSelected) < maxGenes ? 0 : parseInt(filter.GeneSelected)-startOffset;

	for (let index = 0; index < speciesList.length; index++) {
		const ilement = speciesList[index];

		let temp = [];
		let jndex = startGene;

		while (temp.length < maxGenes+1) {
			temp.push(ilement[jndex]);
			jndex++;
		}

		listSet.push(temp);
	}

	return listSet;
}

const orderRest = (OutArray,focusOrdered,unOrderedList) => {
	let i = 0;
	let j = 0;
	let minQ = focusOrdered[i];
	while (j < unOrderedList.length) {
		if (unOrderedList[j] !== -1) {
			const ind = unOrderedList.findIndex((elem) => elem === minQ);
			swapElem(unOrderedList, j, ind);
			OutArray.forEach((elem) => {
				swapElem(elem, j, ind);
			});
			// swapElem(OutArray,j, ind)
			i += 1;
			minQ = focusOrdered[i];
		}

		j += 1;
	}
};

export { quickSort, randomColor, prepare, orderRest };
