BUGS: 

A : places buy order @100 - appears in orderbook as Order1
B : places sell order @100 - appears in orderbook as Order2 ( but Order1 removed from bid side )
--> No matched FillEvent generated even as both are at same price , 1 out event generated
