#!/bin/bash

echo "🧪 Testando endpoint de especializações..."
echo ""
echo "🔍 Buscando especializações da clínica código 1:"
curl -s http://192.168.100.198:4000/clinics/1/specializations | json_pp || curl -s http://192.168.100.198:4000/clinics/1/specializations

echo ""
echo ""
echo "🔍 Buscando especializações da clínica código 2:"
curl -s http://192.168.100.198:4000/clinics/2/specializations | json_pp || curl -s http://192.168.100.198:4000/clinics/2/specializations

echo ""
echo ""
echo "🔍 Buscando especializações da clínica código 3:"
curl -s http://192.168.100.198:4000/clinics/3/specializations | json_pp || curl -s http://192.168.100.198:4000/clinics/3/specializations

echo ""
echo ""
echo "✅ Se você ver arrays vazios [], significa que essas clínicas não têm especializações cadastradas."
echo "✅ Se você ver objetos com 'codigo' e 'nome', está funcionando corretamente!"
