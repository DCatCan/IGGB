import is from "@/styles/Inputs.module.css";
import { useContext, useEffect, useState } from "react";
import { Genomehandler } from "@/context/GenomeHandler";
import { useRouter } from "next/router";

const Dragndrop = () => {
	const handler = useContext(Genomehandler);
	const [speciesInfo, setSpeciesInfo] = useState([]);
	const router = useRouter()

	const handleSpecies = (x) => {
		setSpeciesInfo(x);

	};
	useEffect(() =>{
		if (handler.getShared().length > 0) {
			handleSpecies(handler.getSpecies());

		}
		

	}, [handler.getShared()])
	const handleSpeciesSubmit = (e) => {
		e.preventDefault();
		handler.setSpeciesInfo(speciesInfo);
		router.push('/');
	}
	const orderHandler = (e) => {};
	return (
		<>
			<form id={is["file-upload"]} onSubmit={handleSpeciesSubmit}>
				<div className={is.input_container}>
					<div className={is.square}>
						<input
							type="file"
							name="sharedRef"
							id="sharedInput"
							onChange={(e) => (handler.setShared(e))}
						/>
					</div>
					<div className={is.square}>
						<input
							type="file"
							name="orderRef"
							id="orderInput"
							multiple={true}
							onChange={(e) => handler.setOrder(e)}
						/>
					</div>
				</div>
				<div className={is.genedisplay}>
					<div className={is.speciesDisp}>
						{
							<DisplayInput
								speciesInfo={speciesInfo}
								setSpeciesInfo={setSpeciesInfo}
							/>
						}
					</div>
					<div className={is.buttonContainer}>
						<button type="reset">Clear</button>
						<button type="submit">Submit</button>
					</div>
				</div>
			</form>
		</>
	);
};

// handle drag events
// const handleDrag = function (e) {
// 	e.preventDefault();
// 	e.stopPropagation();
// 	if (e.type === "dragenter" || e.type === "dragover") {
// 		setDragActive(true);
// 	} else if (e.type === "dragleave") {
// 		setDragActive(false);
// 	}
// };

function DisplayInput({ speciesInfo, setSpeciesInfo }) {
	return (
		<>
			{speciesInfo.map((elem, i) => (
				<SpeciesName
					key={i}
					index={i}
					setSpeciesInfo={setSpeciesInfo}
					speciesInfo={elem}
				/>
			))}
		</>
	);
}

function SpeciesName({ index, speciesInfo, setSpeciesInfo }) {
	const pClass = speciesInfo[1] ? is.marked : null;
	const handleClick = () => {
		setSpeciesInfo((existingItems) => {
			const element = [speciesInfo[0], !speciesInfo[1]]
			return [
				...existingItems.slice(0, index),element,...existingItems.slice(index + 1),
			];
		});
	};

	return (
		<>
			
			<p
				className={pClass}
				key={index}
				onClick={handleClick}>
				{index+1}{". "}
				{speciesInfo[0]}
			</p>
		</>
	);
}

export default Dragndrop;
