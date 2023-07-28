import { useState, useContext, useEffect, useRef, useMemo } from "react";
import sps from "@/styles/species.module.css";
import Image from "next/image";
import arrow from "@/public/down-arrow.png";
import { Input } from "postcss";
import { Genomehandler } from "@/context/GenomeHandler";

function Filter({ geneFilter, handleSubmit }) {
	const [active, setActive] = useState(false);
	const ContainerClass = active ? sps.hide : null;
	const buttonClass = active ? sps.up : null;
	const handleHide = () => {
		setActive(!active);
	};

	return (
		<div className={`${ContainerClass} ${sps.filterContainer}`}>
			<button
				className={`${sps.filterActivation}`}
				onClick={handleHide}>
				<span className={`${buttonClass}`}>
					<Image
						src={arrow}
						alt=">"></Image>
				</span>
			</button>

			{
				<FormFilter
					geneFilter={geneFilter}
					setFilter={handleSubmit}
				/>
			}
		</div>
	);
}

function FormFilter({ geneFilter, setFilter }) {
	const handler = useContext(Genomehandler);
	const tracks = handler.getShared()
	const [genes, setGenes] = useState(handler.getGenomeSet(parseInt(geneFilter.GeneSelected)))

	

	const species = handler.getSpecies();
	const activeSpecies = species.filter((elem) => elem[1]);

	const handleSpeciesChange = (e) => {
		const { value } = e.target;
		setGenes(tracks[value]);
		console.log(`speciesVal: ${tracks[value]}`);
	}
	const handleChange = (e) => {
		console.log(e.target.value);
	}

	return (
		<>
			<form
				className={sps.filterForm}
				onSubmit={setFilter}>
				<div className={sps.maxGenes}>
					<label htmlFor="maxGenes">Max. Output</label>
					<input
						type="number"
						name="maxGenes"
						id="maxGenes"
						min={1}
						max={handler.getGenomeSet(0).length}
						defaultValue={geneFilter.maxGenes}
						className={sps.maxOutput}
					/>
				</div>
				{/* <div className={sps.organize}>
					<label htmlFor="OrganizeGenes">Order Genes</label>
					<input
						type="checkbox"
						name="OrganizeGenes"
						id="OrganizeGenes"
						value={false}
						onChange={(e) => (e.target.value === e.target.checked ? 1 : 0)}
					/>
				</div> */}

				<div className={sps.SpeciesSelected}>
					<label htmlFor="SpeciesSelected">Focus Species:</label>
					<select
						name="SpeciesSelected"
						id="SpeciesSelected"
						className={sps.SpeciesSelected}
						onChange={handleSpeciesChange}>
						{activeSpecies.map((elem, index) => {
							return (
								<option
									value={elem[3]}
									key={`SpeciesSel${index}`}>
									{elem[0]}
								</option>
							);
						})}
					</select>
				</div>
				<div className={sps.GeneSelected}>
					<label htmlFor="GeneSelected">Gene To focus</label>
					<select
						name="GeneSelected"
						id="GeneSelected" onChange={handleChange}>
						{genes.map((elem, index) => 
							elem !== "---" && elem !== "---\r" ? (
								<option
									value={index}
									key={`GeneSelected${index}`}>
									{elem}
								</option>
							) : null
						)}
					</select>
				</div>

				<button
					type="submit"
					className={sps.filterSubmit}>
					Filter
				</button>
			</form>
		</>
	);
}

export default Filter;
