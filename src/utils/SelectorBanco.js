const bancosList = [
  {
    slug: 'BANAMEX',
    name: 'Banco Nacional de México, S.A.'
  },
  {
    slug: 'SERFIN',
    name: 'Banca Serfin, S.A.'
  },
  {
    slug: 'ATLÁNTICO',
    name: 'Banco del Atlántico, S.A.'
  },
  {
    slug: 'CITIBANK',
    name: 'Citibank México, S.A.'
  },
  {
    slug: 'UNIÓN',
    name: 'Banco Unión, S.A.'
  },
  {
    slug: 'CONFÍA',
    name: 'Confía, S.A.'
  },
  {
    slug: 'BBVA BANCOMER',
    name: 'BBVA Bancomer, S.A.'
  },
  {
    slug: 'INDUSTRIAL',
    name: 'Banco Industrial, S.A.'
  },
  {
    slug: 'SANTANDER',
    name: 'Banco Santander (México), S.A.'
  },
  {
    slug: 'INTERBANCO',
    name: 'Banco Interestatal, S.A.'
  },
  {
    slug: 'BBVA SERVICIOS',
    name: 'BBVA Bancomer Servicos, S.A.'
  },
  {
    slug: 'HSBC',
    name: 'HSBC México, S.A.'
  },
  {
    slug: 'GE MONEY',
    name: 'GE Money Bank S.A.'
  },
  {
    slug: 'SURESTE',
    name: 'Banco del Sureste, S. A.'
  },
  {
    slug: 'CAPITAL',
    name: 'Banco Capital, S.A.'
  },
  {
    slug: 'BAJÍO',
    name: 'Banco del Bajío, S.A.'
  },
  {
    slug: 'IXE',
    name: 'Ixe Banco, S.A.'
  },
  {
    slug: 'INBURSA',
    name: 'Banco Inbursa, S.A.'
  },
  {
    slug: 'INTERACCIONES',
    name: 'Banco Interacciones, S.A.'
  },
  {
    slug: 'MIFEL',
    name: 'Banca Mifel, S.A.'
  },
  {
    slug: 'SCOTIABANK INVERLAT',
    name: 'Scotiabank Inverlat, S.A.'
  },
  {
    slug: 'PRONORTE',
    name: 'Banco Promotor del Norte, S.A.'
  },
  {
    slug: 'QUADRUM',
    name: 'Banca Quadrum, S.A.'
  },
  {
    slug: 'BANREGIO',
    name: 'Banco Regional de Monterrey, S.A.'
  },
  {
    slug: 'INVEX',
    name: 'Banco Invex, S.A.'
  },
  {
    slug: 'BANSI',
    name: 'Bansi, S.A.'
  },
  {
    slug: 'AFIRME',
    name: 'Banca Afirme, S.A.'
  },
  {
    slug: 'ANÁHUAC',
    name: 'Banco Anáhuac, S.A.'
  },
  {
    slug: 'PROMEX',
    name: 'Banca Promex, S.A.'
  },
  {
    slug: 'BANPAÍS',
    name: 'Banpaís, S.A.'
  },
  {
    slug: 'BANORTE/IXE',
    name: 'Banco Mercantil del Norte, S.A.'
  },
  {
    slug: 'ORIENTE',
    name: 'Banco de Oriente, S.A.'
  },
  {
    slug: 'BANCEN',
    name: 'Banco del Centro, S. A.'
  },
  {
    slug: 'CREMI',
    name: 'Banca Cremi, S.A.'
  },
  {
    slug: 'INVESTA BANK',
    name: 'Investa Bank, S.A.'
  },
  {
    slug: 'AMERICAN EXPRESS',
    name: 'American Express Bank (México), S.A.'
  },
  {
    slug: 'SANTANDER',
    name: 'Banco Santander de Negocios México, S.A.'
  },
  {
    slug: 'BAMSA',
    name: 'Bank of America México, S.A.'
  },
  {
    slug: 'BOSTON',
    name: 'BankBoston, S.A.'
  },
  {
    slug: 'TOKYO',
    name: 'Bank of Tokyo-Mitsubishi UFJ (México), S.A.'
  },
  {
    slug: 'BNP',
    name: 'BNP (México), S.A.'
  },
  {
    slug: 'JP MORGAN',
    name: 'Banco JP Morgan, S.A.'
  },
  {
    slug: 'MONEX',
    name: 'Banco Monex, S.A.'
  },
  {
    slug: 'VE POR MÁS',
    name: 'Banco Ve por Más, S.A.'
  },
  {
    slug: 'BANK ONE',
    name: 'Bank One(México), S.A.'
  },
  {
    slug: 'FUJI',
    name: 'Fuji Bank (México), S.A.'
  },
  {
    slug: 'ING',
    name: 'ING Bank (México), S.A.'
  },
  {
    slug: 'NATIONSBANK',
    name: 'Nationsbank de México, S.A.'
  },
  {
    slug: 'REPUBLIC NY',
    name: 'HSBC Bank México, S.A.'
  },
  {
    slug: 'SOCIÉTÉ',
    name: 'Société Générale México, S.A.'
  },
  {
    slug: 'DEUTSCHE',
    name: 'Deutsche Bank México, S.A.'
  },
  {
    slug: 'Credit Suisse First Boston',
    name: 'Banco Credit Suisse (México), S.A.'
  },
  {
    slug: 'AZTECA',
    name: 'Banco Azteca, S.A.'
  },
  {
    slug: 'AUTOFIN',
    name: 'Banco Autofin México, S.A.'
  },
  {
    slug: 'BARCLAYS',
    name: 'Barclays Bank México, S.A.'
  },
  {
    slug: 'COMPARTAMOS',
    name: 'Banco Compartamos, S.A.'
  },
  {
    slug: 'BANCO FAMSA',
    name: 'Banco Ahorro Famsa, S.A.'
  },
  {
    slug: 'BANCO MULTIVA',
    name: 'Banco Multiva, S.A.'
  },
  {
    slug: 'BM ACTINVER',
    name: 'Banco Actinver, S.A.'
  },
  {
    slug: 'WAL-MART',
    name: 'Banco Wal-Mart de México Adelante, S.A.'
  },
  {
    slug: 'INTERCAM BANCO',
    name: 'Intercam Banco, S.A.'
  },
  {
    slug: 'BANCOPPEL',
    name: 'BanCoppel, S.A.'
  },
  {
    slug: 'ABC CAPITAL',
    name: 'ABC Capital, S.A.'
  },
  {
    slug: 'UBS BANK',
    name: 'UBS Bank México, S.A.'
  },
  {
    slug: 'CONSUBANCO',
    name: 'Consubanco, S.A.'
  },
  {
    slug: 'VOLKSWAGEN',
    name: 'Volkswagen Bank, S.A.'
  },
  {
    slug: 'CIBANCO',
    name: 'CIBanco, S.A.'
  },
  {
    slug: 'BANK NEW YORK',
    name: 'The Bank of New York Mellon, S.A.'
  },
  {
    slug: 'BM BASE',
    name: 'Banco Base, S.A.'
  },
  {
    slug: 'BICENTENARIO',
    name: 'Banco Bicentenario, S.A.'
  },
  {
    slug: 'BANKAOOL',
    name: 'Bankaool, S.A.'
  },
  {
    slug: 'PAGATODO',
    name: 'Banco Pagatodo, S.A.'
  },
  {
    slug: 'FORJADORES',
    name: 'Banco Forjadores, S.A.'
  },
  {
    slug: 'INMOBILIARIO',
    name: 'Banco Inmobiliario Mexicano, S.A.'
  },
  {
    slug: 'DONDÉ',
    name: 'Fundación Dondé Banco, S.A.'
  },
  {
    slug: 'BANCREA',
    name: 'Banco Bancrea, S.A.'
  },
  {
    slug: 'CHIHUAHUA',
    name: 'Banco Progreso Chihuahua, S.A.'
  },
  {
    slug: 'FINTERRA',
    name: 'Banco Finterra, S.A.'
  },
  {
    slug: 'BANK OF CHINA',
    name: 'Industrial and Commercial Bank of China México, S.A.'
  },
  {
    slug: 'Bancrecer, S.A.',
    name: 'Bancrecer, S.A.'
  },
  {
    slug: 'OBRERO',
    name: 'Banco Obrero, S.A.'
  }
]

const SelectorBanco = ({ register }) => {
  return (
  <div className="hook__pagos">
    <select { ...register('banco', { required: true })}>
    {
      bancosList
        .sort((a, b) => {
          if (a.slug < b.slug) { return -1 }
          if (a.slug > b.slug) { return 1 }
          return 0
        })
        .map((item, index) => <option key={index} value={item.slug}>{item.slug}</option>)
    }
    </select>
  </div>
  )
}

export default SelectorBanco
