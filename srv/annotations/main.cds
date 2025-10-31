using { MainService } from '../routes/main';

annotate MainService.SalesOrderHeaders with @( 
    UI: { 
        SelectionFields: [
            id,
            totalAmount,
            customer_id,
            createdAt,
            modifiedAt,
          
        ],
        LineItem: [
            {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : id,
                @HTML5.CssDefaults : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '18%',
                }
              
            },
                 {
                $Type : 'UI.DataField',
                Label : 'Valor total',
                Value : totalAmount,
                @HTML5.CssDefaults : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '10%',
                }
              
            },
                 {
                $Type : 'UI.DataField',
                Label : 'Data de criação',
                Value : createdAt,
                @HTML5.CssDefaults : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '15%',
                }
            },
            {
                $Type : 'UI.DataField',
                Label : 'Criado por:',
                Value : createdBy,
                @HTML5.CssDefaults : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '15%',
                }
            }
        ],
    }
);
