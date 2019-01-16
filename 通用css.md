general

```css
/* 超出省略 */
ellipsis {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

ellipsis-2 {
	display: -webkit-box;
	overflow: hidden;
	text-overflow: ellipsis;
	word-wrap: break-word;
	word-break: break-all;
	white-space: normal !important;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
```

