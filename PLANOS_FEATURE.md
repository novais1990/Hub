# 📋 Feature: Planos de Assinatura

## 📝 Descrição

Sistema completo de planos de assinatura com interface de navegação por abas (menu pages) usando Discord Components V2.

## ✨ Funcionalidades

### 🎯 3 Tipos de Planos

1. **📅 Plano Mensal**
   - Preço: R$ 49,90
   - Duração: 1 mês
   - Benefícios básicos + cancelamento flexível

2. **📆 Plano Trimestral**
   - Preço: R$ 129,90
   - Duração: 3 meses
   - Economia de 13% (R$ 19,80)
   - Benefícios estendidos + desconto especial

3. **📋 Plano Anual**
   - Preço: R$ 449,90
   - Duração: 12 meses
   - Economia de 25% (R$ 148,90)
   - Melhor custo-benefício + bônus exclusivos + suporte VIP

### 🛡️ Seguro de Proteção

- **Opção adicional**: +R$ 5/mês
- **Cobertura**: Devolução de 50% do valor do mês em caso de falência da empresa
- **Seleção**: Menu dropdown em cada plano
- **Flexível**: Cliente escolhe se quer ou não o seguro

## 🎨 Interface (Components V2)

### Estrutura de Componentes

```
Container (type 17)
├── Navigation Tabs (type 15) → Abas de navegação
│   ├── 📅 Mensal (tab_plano_mensal)
│   ├── 📆 Trimestral (tab_plano_trimestral)
│   └── 📋 Anual (tab_plano_anual)
├── TextDisplay (type 14) → Detalhes do plano
│   ├── Título do plano
│   ├── Preço
│   ├── Duração
│   ├── Economia (se aplicável)
│   └── Lista de benefícios
├── Separator (type 13) → Divisor visual
├── SelectMenu → Escolha do seguro
│   ├── ❌ Sem seguro
│   └── 🛡️ Com seguro (+R$ 5/mês)
└── ActionRow → Botões de ação
    ├── 💰 Assinar Agora
    └── 🏠 Voltar
```

## 🚀 Como Usar

### Para Usuários

1. Use o comando `/painel` no Discord
2. Clique no botão **"📋 Planos de Assinatura"**
3. Navegue entre as abas para ver os diferentes planos
4. Selecione se deseja o seguro (opcional)
5. Clique em **"Assinar Agora"** para confirmar

### Para Desenvolvedores

#### Acessar o Painel de Planos

```javascript
const { getPainelPlanos } = require('./src/panels/painelPlanos');

// Abre o painel com o plano mensal ativo
const components = getPainelPlanos('mensal');

// Ou outro plano
const components = getPainelPlanos('trimestral');
const components = getPainelPlanos('anual');
```

#### Manipular Interações

As interações são tratadas automaticamente em `src/handlers/interactionHandler.js`:

- **Navegação entre abas**: `tab_plano_mensal`, `tab_plano_trimestral`, `tab_plano_anual`
- **Seleção de seguro**: `select_seguro_plano`
- **Assinatura**: `btn_assinar_mensal`, `btn_assinar_trimestral`, `btn_assinar_anual`

## 📂 Arquivos Modificados/Criados

### Novos Arquivos
- ✅ `src/panels/painelPlanos.js` - Painel de planos com menu pages

### Arquivos Modificados
- ✅ `src/panels/painelHome.js` - Adicionado botão "Planos de Assinatura"
- ✅ `src/handlers/interactionHandler.js` - Handlers para navegação e assinatura
- ✅ `src/utils/emojis.js` - Adicionados emojis `planos` e `shield`

## 🔧 Detalhes Técnicos

### Components V2 - Type 15 (Navigation Tabs)

```javascript
{
  type: 15, // Navigation Tabs
  components: [
    {
      label: '📅 Mensal',
      custom_id: 'tab_plano_mensal',
      active: true // Define qual aba está ativa
    },
    // ... outras abas
  ]
}
```

### Armazenamento de Seleções

As seleções do usuário (ex: seguro) são armazenadas temporariamente em `userSelections`:

```javascript
userSelections.set(userId, {
  seguroPlano: 'com_seguro' // ou 'sem_seguro'
});
```

## 🎯 Próximos Passos

### Integração com Sistema de Pagamento

Atualmente, o sistema exibe uma mensagem de demonstração. Para produção:

1. **Integrar com Mercado Pago** (já tem configuração básica no painel)
2. **Criar links de pagamento** baseados no plano selecionado
3. **Processar webhooks** de confirmação de pagamento
4. **Ativar assinatura** após pagamento confirmado
5. **Gerenciar renovações** automáticas

### Melhorias Futuras

- [ ] Adicionar mais opções de planos personalizados
- [ ] Sistema de cupons de desconto
- [ ] Histórico de assinaturas do usuário
- [ ] Cancelamento e reembolso automatizado
- [ ] Notificações de renovação próxima
- [ ] Dashboard de assinaturas ativas

## 📸 Preview da Interface

```
⚙️ PLANO DE ASSINATURA
━━━━━━━━━━━━━━━━━━━━━━━━━

[📅 Mensal] [📆 Trimestral] [📋 Anual]

## ⭐ Plano Mensal

💵 Valor: R$ 49,90
⏰ Duração: 1 mês

Benefícios:
✅ Acesso completo à plataforma
✅ Suporte prioritário
✅ Atualizações automáticas
✅ Cancelamento a qualquer momento

ℹ️ Proteção Seguro: Adicione proteção contra falência
🛡️ Devolução de 50% do valor do mês em caso de falência

━━━━━━━━━━━━━━━━━━━━━━━━━

[Deseja ativar o seguro? (Opcional) ▼]

[💰 Assinar Agora]  [🏠 Voltar]
```

## 🐛 Troubleshooting

### Abas não aparecem
- Verifique se está usando `discord.js ^14.16.0`
- Certifique-se de enviar via REST API (não `interaction.reply()`)
- Confirme que a flag `IS_COMPONENTS_V2` está ativa

### Seleção de seguro não salva
- Verifique se o handler `select_seguro_plano` está registrado
- Confirme que `userSelections` está sendo atualizado corretamente

## 📚 Referências

- [Discord Components V2 Documentation](https://discord.com/developers/docs/components/reference)
- [Navigation Tabs (Type 15)](https://discord.com/developers/docs/interactions/message-components#component-object-component-types)
- Repositório: `/home/runner/work/Hub/Hub`
