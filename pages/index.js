import { useContext, useEffect, useState } from "react";
import sps from "@/styles/species.module.css";
import { Genomehandler } from "@/context/GenomeHandler";
import Speciescontainer from "@/components/Speciescontainer";
import Filter from "@/components/Filter";

export default function Home() {
	const handler = useContext(Genomehandler);
	const infoLabels = [
		"NAME",
		"CHROMOSOME/CONTIG/SCAFFOLD NUMBER",
		"ORIENTATION",
		"POSITION",
		"COORDINATES",
		"START COORDINATE",
		"STOP COORDINATE",
		"ON/OFF",
		"SHORT NAME",
		"NOTES",
	];
	const [geneFilter, setGeneFilter] = useState({
		maxGenes: handler.getGenomeSet(0).length < 10 ? handler.getGenomeSet(0).length : 10,
		OrganizeGenes: 0,
		SpeciesSelected: "0",
		GeneSelected: "0",
	});


	const [info, setInfo] = useState(null);
	const handleFilter = (e) => {
		e.preventDefault();
		for (let index = 0; index < e.target.length; index++) {
			const { name, value } = e.target[index];

			setGeneFilter((existing) => {
				return { ...existing, [name]: value };
			});
		}

	}

	const handleGeneButton = async (information, boolVar) => {
		if (boolVar) {
			setInfo(
				<div className={`${sps["GenInfo"]}`}>
					<div>
						{information.map((elem, i) => {
							return (
								<p key={i}>
									{infoLabels[i]} = {elem}
								</p>
							);
						})}
					</div>
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

	return (
		<div className={sps.container}>
			{info}
			<Speciescontainer
				setFilter={setGeneFilter}
				infoDisplay={handleGeneButton}
				filter={geneFilter}
			/>
			<Filter
				geneFilter={geneFilter}
				handleSubmit={handleFilter}
			/>
		</div>
	);
}
