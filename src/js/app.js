import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let table = parseCode(codeToParse);
        htmltable(table);
    });
});


function htmltable(table) {
    let pastTable=document.getElementById('table');
    for (let j=pastTable.rows.length - 1;j>0;j--){
        pastTable.deleteRow(j);
    }
    for(let i=0; i<table.length; i++) {
        let hTable = document.getElementById('table');
        let row = hTable.insertRow(i+1);
        let line = row.insertCell(0);
        let type = row.insertCell(1);
        let name = row.insertCell(2);
        let cond = row.insertCell(3);
        let value = row.insertCell(4);
        line.innerHTML = table[i]['line'];
        type.innerHTML = table[i]['type'];
        name.innerHTML = table[i]['name'];
        cond.innerHTML = table[i]['condition'];
        value.innerHTML = table[i]['value'];
    }
}


