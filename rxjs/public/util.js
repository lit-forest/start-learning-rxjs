/**
 * 创建容器
 * @param {HTMLElement} node 
 * @returns container
 */
function createContainer(node) {
	const container = document.createElement('div');
	container.style.position = 'relative';
	container.style.top = '0';
	container.style.left = '0';
	container.style.width = '100%';
	container.id = 'container';

	const position = getOffset(node);
	const dropDownMenu = document.createElement('ul');
	dropDownMenu.style.left = position.left + 'px';
	dropDownMenu.style.top = position.top + 4 + 'px';
	dropDownMenu.style.width = node.clientWidth + 'px';
	dropDownMenu.id = 'dropDownMenu'

	container.appendChild(dropDownMenu);

	const mountNode = node.parentNode;
	mountNode.appendChild(container);
	return dropDownMenu;
}
/**
 * 获取元素相对于浏览器的left&top位置
 * @param {HTMLElement} node 
 * @returns 
 */
function getOffset(node) {
	const box = node.getBoundingClientRect();
	const docElem = document.documentElement;
	return {
		left: box.left + (window.pageXOffset || docElem.scrollLeft) -
			(docElem.clientLeft || document.body.clientLeft || 0),
		top: box.top + (window.pageYOffset || docElem.scrollTop) -
			(docElem.clientTop || document.body.clientTop || 0),
	};
}

/**
 * 创建li元素 
 * @param {string|number} data 
 * @returns 
 */
function createItem(data) {
	const result = document.createElement('li');
	result.classList.add('dropdown-menu-item');
	result.innerHTML = data
	return result;
}