## StatelessWidget(无状态)，StatefulWidget(有状态)

有状态才能够进行交互，无状态就仅仅作为显示

* StatelessWidget: Icon、IconButton、Text等。这个就是Flutter中的“展示组件”，自身不保存状态，外部参数变化就销毁重新创建。Flutter建议尽量使用无状态的组件。
* StatefulWidget: Checkbox、Radio、Slider、InkWell、Form、TextField等。状态组件就是类似于React中的“容器组件”了，Flutter中状态组件写法会稍微不一样。