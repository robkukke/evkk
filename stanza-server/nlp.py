import stanza

nlp_tpl = stanza.Pipeline(lang='et', processors='tokenize,pos,lemma')
nlp_tp = stanza.Pipeline(lang='et', processors='tokenize,pos')
nlp_t = stanza.Pipeline(lang='et', processors='tokenize')

nlp_ru_tp = stanza.Pipeline(lang='ru', processors='tokenize,pos')
nlp_ru_t = stanza.Pipeline(lang='ru', processors='tokenize')