import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return makeTab(esprima.parseScript(codeToParse,  { loc: true }),[]);
};
export {parseCode};


function makeTab (parsedCode, table) {
    switch (parsedCode.type) {
    case 'AssignmentExpression':
        table=expressionCase(parsedCode,table);
        break;
    case 'BlockStatement':
        table = updateTableForeach(parsedCode.body, table);
        break;
    case 'ExpressionStatement':
        table= makeTab(parsedCode.expression,table);
        break;
    case 'ForStatement':
        table = forState(parsedCode,table);
        break;
    default:
        table = makeTab1(parsedCode, table);
        break;
    }
    return table;
}
function makeTab1(parsedCode, table){
    switch (parsedCode.type) {
    case 'FunctionDeclaration':
        table = funcDec(parsedCode, table);
        break;
    case 'IfStatement':
        table = ifState(parsedCode,table);
        break;
    case 'Program':
        table = makeTab(parsedCode.body[0], table);
        break;
    case 'ReturnStatement':
        table = returnState(parsedCode,table);
        break;
    default:
        table =makeTab2(parsedCode,table);
        break;
    }
    return table;
}

function makeTab2(parsedCode,table) {
    switch (parsedCode.type) {
    case 'VariableDeclaration':
        table = updateTableForeach(parsedCode.declarations, table);
        break;
    case 'VariableDeclarator':
        table =varDec(parsedCode,table);
        break;
    case 'WhileStatement':
        table=whileState(parsedCode,table);
        break;
    default:
        table = findExp(parsedCode,table);
        break;
    }
    return table;
}

function funcDec(parsedCode,table) {
    table=addLine(parsedCode.id.loc.start.line, 'function declaration', parsedCode.id.name, '', '',table);
    let i=0;
    for (; i<parsedCode.params.length;i++){
        table= addLine(parsedCode.params[i].loc.start.line, 'variable declaration', parsedCode.params[i].name, '', '',table);
    }
    table = makeTab(parsedCode.body,table);
    return table;
}

function addLine(line, type, name, cond, val, table) {
    table.push({'line': line, 'type': type, 'name': name, 'condition': cond, 'value': val});
    return table;
}

function updateTableForeach(list,table){
    let i=0;
    for (; i<list.length;i++){
        table=makeTab(list[i],table);
    }
    return table;
}


function expressionCase(parsedCode,table) {
    table =addLine(parsedCode.loc.start.line, 'assignment expression', ''+baseExp(parsedCode.left), '', ''+baseExp(parsedCode.right),table);
    return table;
}

function whileState(parsedCode,table){
    table = addLine(parsedCode.loc.start.line,'while statement', '', ''+baseExp(parsedCode.test), '',table);
    table = makeTab(parsedCode.body,table);
    return table;
}

function findExp(parsedCode,table){
    switch (parsedCode.type) {
    case 'Literal':
        table= addLine(parsedCode.loc.start.line, parsedCode.type, '', '', baseExp(parsedCode),table);
        break;
    case 'Identifier':
        table = addLine(parsedCode.loc.start.line, parsedCode.type, baseExp(parsedCode), '', '',table);
        break;
    case 'MemberExpression':
        table = addLine(parsedCode.loc.start.line, parsedCode.type, '', '', baseExp(parsedCode),table);
        break;
    case 'BinaryExpression':
        table = addLine(parsedCode.loc.start.line, parsedCode.type, '', baseExp(parsedCode), '',table);
        break;
    default:
        table = findExp1(parsedCode,table);
        break;
    }
    return table;
}

function findExp1(parsedCode,table) {
    switch (parsedCode.type) {
    case 'UnaryExpression':
        table = addLine(parsedCode.loc.start.line, parsedCode.type, baseExp(parsedCode.argument), '',  baseExp(parsedCode),table);
        break;
    case 'LogicalExpression':
        table = addLine(parsedCode.loc.start.line, parsedCode.type, '', '', baseExp(parsedCode),table);
        break;
    case 'UpdateExpression':
        table = addLine(parsedCode.loc.start.line, 'assignment expression', baseExp(parsedCode.argument), '',  baseExp(parsedCode),table);
        break;
    default:
        break;
    }
    return table;
}

function varDec(parsedCode,table) {
    if(parsedCode.init == null)
        table= addLine(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', parsedCode.init,table);
    else {
        if( parsedCode.init.type === 'UnaryExpression') {
            let value = '' + parsedCode.init.operator + baseExp(parsedCode.init.argument);
            table = addLine(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', value, table);
        }
        else
            table = addLine(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', parsedCode.init.value,table);
    }
    return table;
}



function ifState(parsedCode, table) {
    let cond1 =''+baseExp(parsedCode.test);
    table = addLine(parsedCode.loc.start.line,'if statement', '',cond1 ,'',table);
    table = makeTab(parsedCode.consequent,table);
    if(parsedCode.alternate != null){
        let cond2=''+baseExp(parsedCode.alternate.test);
        table = addLine(parsedCode.alternate.loc.start.line, 'else if statement', '', cond2, '',table);
        table = makeTab(parsedCode.alternate.consequent,table);
        if(parsedCode.alternate.alternate != null)
            table = makeTab(parsedCode.alternate.alternate,table);
    }
    return table;
}

function returnState(parsedCode,table) {
    let value =''+baseExp(parsedCode.argument);
    table = addLine(parsedCode.loc.start.line,'return statement', '', '', value,table);
    return table;
}

function forState(parsedCode,table){
    let cond = ''+baseExp(parsedCode.test);
    table = addLine(parsedCode.loc.start.line,'for statement', '', cond, '',table);
    if(parsedCode.init != null)
        table = makeTab(parsedCode.init,table);
    if(parsedCode.update != null)
        table = makeTab(parsedCode.update,table);
    table = makeTab(parsedCode.body,table);
    return table;
}

function baseExp(expression){
    let exp = '';
    switch(expression.type){
    case 'BinaryExpression':
        exp = exp + binary(expression);
        break;
    case 'Identifier':
        exp = exp +expression.name;
        break;
    case 'Literal':
        exp = exp + expression.value;
        break;
    default:
        exp = exp + baseExp1(expression);
        break;
    }
    return exp;
}

function baseExp1(expression) {
    let exp = '';
    switch(expression.type) {
    case 'LogicalExpression':
        exp = exp + baseExp(expression.left);
        exp= exp + ' ' + expression.operator;
        exp = exp + ' ' + baseExp(expression.right);
        break;
    case 'MemberExpression':
        exp = exp + member(expression);
        break;
    case 'UnaryExpression':
        exp = exp + unary(expression);
        break;
    default:
        exp = exp + update(expression);
        break;
    }
    return exp;
}

function binary(expression){
    let exp=baseExp(expression.left);
    exp=exp+' '+ expression.operator;
    exp= exp +' ' +baseExp(expression.right);
    return exp;
}

function member(expression){
    let exp =baseExp(expression.object);
    exp = exp + '[' + baseExp(expression.property) + ']';
    return exp;
}

function unary(expression) {
    let exp=expression.operator;
    exp = exp + baseExp(expression.argument);
    return exp;
}

function  update(expression) {
    if(expression.prefix == false){
        let exp = expression.argument.name;
        exp = exp + expression.operator;
        return exp;
    }
    let exp = expression.operator;
    exp = exp + expression.argument.name;
    return exp;
}
