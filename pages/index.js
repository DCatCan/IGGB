import { useContext, useEffect, useState } from "react";
import sps from "@/styles/species.module.css";
import { Genomehandler } from "@/context/GenomeHandler";
import Speciescontainer from "@/components/Speciescontainer";
import Filter from "@/components/Filter";

export default function Home() {
	const handler = useContext(Genomehandler);
	const [geneFilter, setGeneFilter] = useState({
		maxGenes: 10,
		SpeciesSelected: 0,
		GeneSelected: 0,
	});
	const [speciesOut, setSpeciesOut] = useState([]);
	const [indeces, setIndeces] = useState([]);
	function cleanse(x) {
		//picks out the species that were chosen
		const sharedGenomes = handler.getShared();
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
		//removes any non shared genomes
		const listSet = [];
		let start;
		if (speciesList.length > 0) {
			start =
				geneFilter.GeneSelected < geneFilter.maxGenes
					? 0
					: geneFilter.GeneSelected - Math.ceil(geneFilter.maxGenes / 2);

			for (let index = 0; index < speciesList.length; index++) {
				const ilement = speciesList[index];
				let temp = [];
				let jndex = start;
				while (temp.length < geneFilter.maxGenes) {
					temp.push(ilement[jndex]);
					jndex++;
				}

				listSet.push(temp);
			}
		}
		return listSet;
	}
	useEffect(() => {
		if (handler.getSpecies().length > 0) {
			const a1 = cleanse(handler.getSpecies()); // get the relevant species selected;
			const out = rdyUp(a1); // get the species rdy for display, shave away genomes that the speceis do not share
			setSpeciesOut(out);
		}
	}, [handler.getSpecies(), geneFilter]);

	return (
		<div className={sps.container}>
			<Speciescontainer
				sharedGenomes={speciesOut}
				setFilter={setGeneFilter}
				indeces={indeces}
				speciesNames={handler.getSpecies()}
			/>
			<Filter
				geneFilter={geneFilter}
				setGeneFilter={setGeneFilter}
			/>
		</div>
	);
}
