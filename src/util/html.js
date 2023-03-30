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

/**
 * https://stackoverflow.com/a/442474/1781376
 * @param {*} el 
 * @returns 
 */
export const getOffset = el => {
	var _x = 0;
	var _y = 0;
	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return { top: _y, left: _x };
};
