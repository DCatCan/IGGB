import { useEffect, useState, useContext } from "react";
import sps from "../styles/species.module.css";
import randomColor from "randomcolor";
import { Genomehandler } from "@/context/GenomeHandler";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

const Speciescontainer = ({ setFilter, infoDisplay, filter }) => {
	const handler = useContext(Genomehandler);
	const sharedGenomes = handler.getShared();
	const speciesNames = handler.getSpecies();
	const activeSpecies = handler.getIndeces(); //indeces of the active species
	const orderedGenomes = handler.getOrdered();

	//const [scrollVal, setScrollVal] = useState(10);
	const [speciesOut, setSpeciesOut] = useState([]);

	//color schemas
	const [colorDict, setColorDict] = useState([]);
	const [currentColorInd, setCurrentColorInd] = useState(0);
	const [standardColor, setStandardColor] = useState(
		randomColor({ format: "rgb", count: parseInt(filter.maxGenes) * 4 })
	);

	//-----------------------------------------------

	
	const swapElem = (array, index1, index2) => {
		var temp = array[index1];
		array[index1] = array[index2];
		array[index2] = temp;
	};

	useEffect(() => {
		function getActiveSpecies(x) {
			//picks out the species that were chosen
			const temp = [];
			x.forEach((element, index) => {
				const isActive = element[1];

				if (isActive) {
					let elem = sharedGenomes[index]
					
					temp.push(sharedGenomes[index]);
				}
			});
			return temp;
		}
		function rdyUp(speciesList) {
			const listSet = [];
			let startGene = parseInt(filter.GeneSelected);
			let maxGenes = parseInt(filter.maxGenes);

			for (let index = 0; index < speciesList.length; index++) {
				const ilement = speciesList[index];

				let temp = [];
				let jndex = startGene;
				while (temp.length < maxGenes) {
					temp.push(ilement[jndex]);
					jndex++;
				}

				listSet.push(temp);
			}

			return listSet;
		}
		//Organize the focused species

		const organizer = (OutArray) => {
			//get the index for the pillar, which is mathed to the index of the oredered gene list

			let focusedList = OutArray[parseInt(filter.SpeciesSelected)];
			//get the corresponding gene order list
			const focusGeneOrder = orderedGenomes[parseInt(filter.SpeciesSelected)];

			const G = [];
			let G_un = [];
			focusedList.map((elem, index) => {
				if (elem !== "---" && elem !== "---\r") {
					G.push(focusGeneOrder.findIndex((el) => el[0] === elem));
				}
				const foundIndex =
					elem !== "---" && elem !== "---\r"
						? focusGeneOrder.findIndex((el) => el[0] === elem)
						: -1;
				G_un.push(foundIndex);
			});

			// QuickSort to sort the focused set.
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
			const quickSort = (array, minI, maxI) => {
				if (minI < maxI) {
					let partitionI = partition(array, minI, maxI);

					quickSort(array, minI, partitionI - 1);
					quickSort(array, partitionI + 1, maxI);
				}
			};
			quickSort(G, 0, G.length - 1);
			// swapping the homologous genes around after the focused order
			let i = 0;
			let j = 0;
			let minQ = G[i];
			while (j < G_un.length) {
				if (G_un[j] !== -1) {
					const ind = G_un.findIndex((elem) => elem === minQ);
					swapElem(G_un, j, ind);
					OutArray.forEach((elem) => {
						swapElem(elem, j, ind);
					});
					// swapElem(OutArray,j, ind)
					i += 1;
					minQ = G[i];
				}

				j += 1;
			}
		};

		if (speciesNames.length > 0) {
			const a1 = getActiveSpecies(speciesNames); // get the relevant species selected;
			
			let out = rdyUp(a1); // get the species rdy for display, shave away genomes that the speceis do not share
			if (
				filter.OrganizeGenes &&
				orderedGenomes[parseInt(filter.SpeciesSelected)]
			) {
				//organize the focused species to ge G
				organizer(out);
			}
			console.log(filter);
			setSpeciesOut(out);
		}

		return () => console.log("unmount Container class");
	}, [speciesNames, filter, orderedGenomes]);
	useEffect(()=> {
		console.log(colorDict);
	},[colorDict])

	//-----------------------------------------------------------------------------------------------

	return (
		<div className={sps.speciesContainer}>
			{speciesOut.map((elem, index) => {
				let speciesInf = handler.getSpecificSpecies(activeSpecies[index]);

				const chosen =
					index === parseInt(filter.SpeciesSelected) ? true : false;
				const chosenStyle = chosen ? sps.chosen : "";

				return (
					<div
						className={sps.species}
						key={`s${index}`}>
						<div className={`${sps.speciesLabel} ${chosenStyle}`}>
							<h3>
								{speciesInf[0]}
								{orderedGenomes[activeSpecies[index]] ? "*" : null}
							</h3>
						</div>
						<Species
							key={`species${index}`}
							genes={elem}
							infoDisplay={infoDisplay}
							filter={filter}
							OG={orderedGenomes[activeSpecies[index]]}
							colorDict={colorDict}
							setColorDict={setColorDict}

						/>
					</div>
				);
			})}
		</div>
	);
};

const Species = ({ genes, colorDict, infoDisplay, OG, filter, setColorDict }) => {
	const generateColor = (info,index) => {
		const randomColor = () => {
			let x = Math.round(0x222222+ 0x666666 * Math.random() ).toString(16);
			var y = 6 - x.length;
			var z = "000000";
			var z1 = z.substring(0, y);
			return "#" + z1 + x;
		};

		let chr = info.length > 1 ? info[1] : index ;
		let newColor = randomColor();
		
		if (!OG && info.length < 2 && filter.OrganizeGenes) {
			chr = -1;
			newColor = "rgb(0,0,0)"
		}
		if (!filter.OrganizeGenes) {
			chr = index
		}
		
		if (chr in colorDict) {
			return colorDict[chr];
		} else {
			let colorExist = Object.values(colorDict).includes(newColor);
			while (colorExist) {
				newColor = randomColor();
				colorExist = Object.values(colorDict).includes(newColor);

			}
			
			setColorDict((exist) =>{return { ...exist, [chr]: newColor }});
			return newColor;
		}
	};

	return (
		<div className={`${sps.species_container} `}>
			{genes.map((elem, index) => {
				let details;
				if (OG && filter.OrganizeGenes) {
					// console.log(OG[OG.findIndex(el=> el[0] ===elem)]);

					if (elem !== "---" && elem !== "---\r") {
						const indexOfgene = OG.findIndex((el) => el[0] === elem);
						details = OG[indexOfgene];
					} else {
						details = undefined;
					}
				}
				const chosen = filter.ge
				const tempInfo = details ? details : [elem];
				const colorOut = generateColor(tempInfo,index)
				return (
					<Gene
						key={index}
						color={colorOut}
						infoDisplay={infoDisplay}
						geneInfo={tempInfo}
					/>
				);
			})}
		</div>
	);
};

function Gene({ geneInfo, color, infoDisplay }) {
	const [out, setOut] = useState();
	
	useEffect(() => {
		if (geneInfo.length > 0) {
			geneInfo[0] !== "---" && geneInfo[0] !== "---\r"
				? setOut(() => {
						const geneChro = geneInfo.length > 1 ? geneInfo[1] : "";
						return (
							<button
								className={sps.genome}
								style={{ backgroundColor: color }}
								onClick={async () => {
									const information = geneInfo;
									await infoDisplay(information, true);
								}}>
								<div>
									<p className="chr">{geneChro}</p>
									<p>{geneInfo[0]}</p>
								</div>
							</button>
						);
				  })
				: setOut(
						<div
							className={sps.genome}
							style={{ backgroundColor: "rgba(0,0,0,0.1)" }}></div>
				  );
		}
	}, [geneInfo]);

	return <div>{out}</div>;
}

export default Speciescontainer;
