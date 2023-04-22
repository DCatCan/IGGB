import { useContext, useEffect, useState } from "react";
import sps from "@/styles/species.module.css";
import { Genomehandler } from "@/context/GenomeHandler";
import Speciescontainer from "@/components/Speciescontainer";
import Filter from "@/components/Filter";

export default function Home() {
	const handler = useContext(Genomehandler);
	const [geneFilter, setGeneFilter] = useState({
		maxGenes: 5,
		SpeciesSelected: 0,
		GeneSelected: 0,
	});
	const [speciesOut, setSpeciesOut] = useState([]);
	const [indeces, setIndeces] = useState([]);
	const [info, setInfo] = useState();

	const handleGeneButton = (information, boolVar) => {
		//temp, fix it back!

		if (boolVar) {
			setInfo(
				<div className={`${sps["GenInfo"]}`}>
					{information.map((elem, i) => {
						return (
							<p key={i}>
								{infoLabels[i]} = {elem}
							</p>
						);
					})}
					<button
						onClick={() => {
							setInfo();
						}}>
						Close
					</button>
				</div>
			);
		} else {
			setInfo();
		}
	};

	useEffect(() => {
		const handl = handler;
		function cleanse(x) {
			//picks out the species that were chosen
			const sharedGenomes = handl.getShared();
			const temp = [];
			x.forEach((element, index) => {
				const state = element[1];
				if (state) {
					temp.push(sharedGenomes[index]);
					setIndeces((elem) => [...elem, index]);
				}
			});
			return temp;
		}
		function rdyUp(speciesList) {
			const listSet = [];
			let start =
				geneFilter.GeneSelected < geneFilter.maxGenes
					? 0
					: parseInt(geneFilter.GeneSelected);
			for (let index = 0; index < speciesList.length; index++) {
				const ilement = speciesList[index];
				let temp = [];
				let jndex = start;
				while (temp.length < parseInt(geneFilter.maxGenes)) {
					temp.push(ilement[jndex]);
					jndex++;
				}

				listSet.push(temp);
			}

			return listSet;
		}
		console.log(handl.getSpecies());

		if (handl.getSpecies().length > 0) {
			const a1 = cleanse(handl.getSpecies()); // get the relevant species selected;
			const out = rdyUp(a1); // get the species rdy for display, shave away genomes that the speceis do not share

			setSpeciesOut(out);
		}

		return () => console.log("unmounted after filter or species");
	}, [handler.getSpecies(), geneFilter]);

	return (
		<div className={sps.container}>
			{info}
			<Speciescontainer
				sharedGenomes={speciesOut}
				setFilter={setGeneFilter}
				indeces={indeces}
				speciesNames={handler.getSpecies()}
				infoDisplay={handleGeneButton}
				filter={geneFilter}
				orderGenomes={handler.getOrdered()}
			/>
			<Filter
				geneFilter={geneFilter}
				setFilter={setGeneFilter}
			/>
		</div>
	);
}

const infoLabels = [
	"Position",
	"NAME",
	"ORIENTATION",
	"START COORDINATE",
	"STOP COORDINATE",
	"ON/OFF",
	"CHROMOSOME/CONTIG/SCAFFOLD NUMBER",
	"SHORT NAME",
	"COORDINATES",
	"NOTES",
];
