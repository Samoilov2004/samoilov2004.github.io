.PHONY: all en ru

all: en ru

en:
	mkdir -p /tmp/samoilov-cv-en
	latexmk -xelatex -interaction=nonstopmode -halt-on-error -outdir=/tmp/samoilov-cv-en cv_en.tex
	cp /tmp/samoilov-cv-en/cv_en.pdf Mikhail_Samoilov_CV_EN.pdf

ru:
	mkdir -p /tmp/samoilov-cv-ru
	latexmk -xelatex -interaction=nonstopmode -halt-on-error -outdir=/tmp/samoilov-cv-ru cv_ru.tex
	cp /tmp/samoilov-cv-ru/cv_ru.pdf Mikhail_Samoilov_CV_RU.pdf

