
export class Datahandler {
	constructor() {
		this._sharedData = new Array();
		this._orderedData = new Array();
		this._species = new Array();
	}

	set sharedData(e) {

		const reader = new FileReader();
		reader.onloadend = () => {
			const res = reader.result.split("\n").map((row) => {
				return row.split("\t");
			});
			const spec = res.splice(0, 1).flat();

			this._species = spec;
			const sharedGenomes = [];
			for (let i = 0; i < res[0].length; i++) {
				const temp = [];
				temp.push(
					res.map((elem) => {
						return elem[i];
					})
				);
				sharedGenomes.push(temp.flat());
			}

			this._sharedData = sharedGenomes;
		};
		reader.readAsText(e.target.files[0]);
		return this._sharedData;
		
	}
	set species(x){ this._species = x}
	set orderData(x) {
		const reader = new FileReader();
		reader.onloadend = () => {};
		reader.readAsText(e.target.files[0]);
	}

	get sharedData() {
		return this._sharedData;
	}
	get orderData() {
		return this._orderedData;
	}
	get species() {
		return this._species
	}
	
	set reset(x) {
		this.sharedData([]);
		this.orderData([]);
		this.species([]);
	}
	
}

// orderFunk
// const res = reader.result.split("\n").map((row) => {
//     return row.split("\t");
//   });
//   const name = e.target.files[0].name.replace(/[.]\w+/, "");
//   !options.speciesRdy.includes(name)
//     ? (options.speciesRdy.push(name), pillarfunc([...pillarO, res]))
//     : alert("Already in!");

//   options.speciesRdy.length === 1
//     ? (options.speciesFocus = options.speciesRdy[0])
//     : null;
