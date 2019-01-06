## CSS 动画

  API的简介及简单动画的实现

### 一.3D转换（transform）
1. 定义向元素应用 2D 或 3D 转换，可以对元素进行移动、缩放、转动、拉长或拉伸
    - 转换方法 
      - translate(移动) 根据X轴和Y轴位置给定的参数，从当前元素位置移动
        ```
        transform: translate(100px,200px);
        ```
      - rotate（旋转） 给定度数顺时针旋转的元素。负值则为逆时针旋转
        ```
        transform: rotate(60deg);
        ```
      - scale (缩放) 对元素减小或者放大，取决于宽度（X轴）和高度（Y轴）的参数
        ```
        transform: scale(2,2);
        ```
      - skew (倾斜) 根据X轴和Y轴位置给定的角度参数，进行倾斜，负数则为反方向倾斜
        ```
        transform: skew(40deg,50deg);
        ```
2. transform-origin：允许改变被转换元素的位置
3. transform-style：规定被嵌套元素如何在 3D 空间中显示
    - preserve-3d	：表示所有子元素在3D空间中呈现
    - flat：表示所有子元素在2D平面呈现 
      ```
      transform-style: flat|preserve-3d;
      ```
4. perspective:设置元素距离视图的距离，以像素计，与 perspective-origin 属性一同使用，能够改变 3D 元素的底部位置
      ```
      perspective: number|none;
      ``` 
5. backface-visibility:定义当元素不面向屏幕时是否可见，在旋转元素不希望看到其背面时，该属性很有用
      ```
      backface-visibility: visible|hidden;
      ```
### 二.CSS3过渡（transition）
### 三.CSS3 动画（animation及@keyframes）

  