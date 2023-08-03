import { useState, useContext, useEffect, useRef, useMemo } from "react";
import sps from "@/styles/species.module.css";
import Image from "next/image";
import arrow from "@/public/down-arrow.png";
import { Input } from "postcss";
import { Genomehandler } from "@/context/GenomeHandler";

function Filter({ geneFilter, handleSubmit, setpressed, pressed }) {
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
					setpressed={setpressed}
					pressed={pressed}
				/>
			}
		</div>
	);
}

function FormFilter({ geneFilter, setFilter, setpressed, pressed }) {
	const handler = useContext(Genomehandler);
	const tracks = handler.getShared()

	const [genes, setGenes] = useState(handler.getGenomeSet(parseInt(geneFilter.GeneSelected)))



	const species = handler.getSpecies();
	const activeSpecies = species.filter((elem) => elem[1]);

	const handleSpeciesChange = (e) => {
		const { value } = e.target;
		setGenes(tracks[value]);
		document.getElementById("GeneSelected").value = -1

	}
	const handleChange = (e) => {
		const a = document.getElementById("GeneSelected").options
		const b = Array.from(a).filter(option => option.value === e.target.value);
		document.getElementById("focusName").value = b[0].text;


	}
	const handleSubmit = (e) => {
		setFilter(e)
		setpressed(pressed + 1)
	}

	return (
		<>
			<form
				className={sps.filterForm}
				onSubmit={(e) => {
					setFilter(e)
					setpressed(pressed + 1)
				}}>
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
						onChange={handleSpeciesChange} defaultValue={-1}>
						<option
							value={-1}>
							---
						</option>
						{activeSpecies.map((elem, index) => {
							return (
								<option
									value={elem[3]}
									key={`SpeciesSel${index}`} label={elem[0]} />

							);
						})}
					</select>
				</div>
				<div className={sps.GeneSelected}>
					<label htmlFor="GeneSelected">Gene To focus</label>
					<select
						name="GeneSelected"
						id="GeneSelected" onChange={handleChange} defaultValue={-1}>
						<option
							value={-1}>
							---
						</option>						{genes.map((elem, index) =>
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
				<input type="hidden" name="focusName" id="focusName"></input>


				<button
					type="submit"
					className={sps.filterSubmit} id="filterSubmit">
					Filter
				</button>
			</form>
		</>
	);
}

export default Filter;
