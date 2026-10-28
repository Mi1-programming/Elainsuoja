/** @format */

function BuildBreadcrumbs() {
	const parent = document.getElementById("breadcrumbs");
	const breadcrumbs = JSON.parse(parent.innerHTML);
	parent.innerHTML = "";

	let path = "";
	let index = 0;
	breadcrumbs.forEach((breadcrumb) => {
		const isLastChild = index == breadcrumbs.length - 1;
		path += `/${breadcrumb.path}`;

		if (isLastChild) {
			const p = document.createElement("p");
			p.innerText = breadcrumb.name;
			parent.appendChild(p);
		} else {
			const a = document.createElement("a");
			a.innerText = breadcrumb.name;
			a.href = path;
			parent.appendChild(a);
		}

		if (!isLastChild) {
			const arrow = document.createElement("p");
			arrow.innerText = "→";
			parent.appendChild(arrow);
		}

		index++;
	});
}

BuildBreadcrumbs();
