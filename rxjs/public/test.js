<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Document</title>
	<style>
		html,
		body {
			margin: 0;
			padding: 0;
			font-family: -apple-system;
		}

		.autoComplete-input {
			position: relative;
			top: 200px;
			left: 500px;
			height: 32px;
			width: 200px;
			box-sizing: border-box;
			padding: 4px 11px;
			border: 1px solid #d9d9d9;
			border-radius: 4px;
		}

		.autoComplete-input:hover {
			border-color: #40a9ff;
		}

		.autoComplete-input:focus {
			border-color: #40a9ff;
			outline: 0;
			-webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
			box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
		}

		#dropDownMenu {
			position: absolute;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
			border-radius: 4px;
			background-color: #fff;
			max-height: 250px;
			outline: none;
			margin: 0;
			padding-left: 0;
			list-style: none;
			overflow-y: auto;
		}

		.dropdown-menu-item {
			padding: 5px 12px;
			font-size: 14px;
			line-height: 22px;
			color: rgba(0, 0, 0, 0.65);
			cursor: pointer;
		}

		.dropdown-menu-item:hover {
			background-color: #e6f7ff;
		}

		.dropdown-menu-item-selected {
			background-color: #e6f7ff;
		}

		.li {
			margin-bottom: 1500px;
		}

		.container {
			height: 500px;
			width: 1000px;
			background-color: rebeccapurple;
			overflow-y: auto;
		}
	</style>
</head>

<body>
	<div class="container">
		<form>
			<input type="text" id="textInput" class="autoComplete-input" placeholder="Enter Query...">
		</form>
		<ul>
			<li class="li">dsadadasdasdsd</li>
			<li>dsadadasdasdsd</li>
			<li>dsadadasdasdsd</li>
			<li>dsadadasdasdsd</li>
			<li>dsadadasdasdsd</li>
			<li>dsadadasdasdsd</li>
			<li>dsadadasdasdsd</li>
		</ul>
	</div>
	<script src="./util.js"></script>
	<script src="https://unpkg.com/rxjs/bundles/Rx.min.js"></script>
	<script>
		const $input = document.querySelector('#textInput'),
			$dropDownMenu = createContainer($input);

		// 监听 $input输入框focus事件
		const focus = Rx.Observable.fromEvent($input, 'focus')
			.filter(e => $dropDownMenu.querySelectorAll('li').length > 0)
			.do(e => $dropDownMenu.style.display = 'block')

		// Get all distinct key up events from the input and only fire if long enough and distinct
		const keyup = Rx.Observable.fromEvent($input, 'keyup')
			.map(e => e.target.value)          // Project the text from the input
			.filter(text => text.length > 2)   // Only if the text is longer than 2 characters
			.debounceTime(750)                 // Pause for 750ms 
			.distinctUntilChanged();           // Only if the value has changed
		// 查询数据
		const searcher = keyup.mergeMap(text => Rx.Observable
			.ajax(`http://localhost:3000/suggest?keyword=${text}`)
			.map(res => res.response)
			.do(list => $dropDownMenu.innerHTML = '')
			.mergeMap(list => Rx.Observable
				.from(list)
				.map(createItem)
				.do($item => $dropDownMenu.appendChild($item))
			)
			.publishReplay(1)
			.refCount()
		);
		// 下拉项点击事件
		const select = searcher.mergeMap($item => Rx.Observable
			.fromEvent($item, 'click')
			.do(event => {
				const parentNode = event.target.parentNode;
				parentNode.querySelectorAll('li').forEach(item => item.classList.contains('dropdown-menu-item-selected') ?
					item.classList.remove('dropdown-menu-item-selected') : '');
				event.target.classList.add('dropdown-menu-item-selected');
				$input.value = event.target.innerHTML;
				$dropDownMenu.style.display = 'none'
			})
		)
		// 合并流
		const app = select.merge(focus)
		// 监听
		app.subscribe(
			() => { },
			error => $dropDownMenu.innerHTML = `<li>${error}</li>`);
	</script>
</body>

</html>