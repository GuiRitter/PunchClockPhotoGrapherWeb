import React from "react";

export const buildCell = (key, content, attributes) => <td
	{...attributes}
	key={key}
>{content}</td>;

export const buildRow = (key, ...cellList) => <tr
	key={key}
>{cellList}</tr>;

export const buildTable = (parameters, ...rowList) => {
	let key = parameters.key;
	delete parameters.key;
	return <table key={key} {...parameters}><tbody>{rowList}</tbody></table>;
};
