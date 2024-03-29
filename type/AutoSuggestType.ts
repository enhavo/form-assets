import FormType from "@enhavo/app/form/FormType";
import Router from "@enhavo/core/Router";
import axios, {CancelTokenSource} from 'axios';

export default class AutoSuggestType extends FormType
{
    private router: Router;

    private source: CancelTokenSource;

    constructor(element: HTMLElement, router: Router)
    {
        super(element);
        this.router = router;
    }

    protected init()
    {
        this.$element.find('input').on('focus keyup change', () => {
            this.updateList(this.$element.find('input').val());
        });

        this.$element.find('input').on('blur', () => {
            this.removeList();
        });

        let $list = this.$element.find('[data-auto-suggest-list]');
        $(document).mouseup((e) => {
            if (!$list.is(e.target) && $list.has(e.target).length === 0) {
                $list.hide();
            }
        });
    }

    private getRoute()
    {
        let data = this.$element.data('auto-suggest');
        return data.route
    }

    private updateList(value: string)
    {
        value = value.toLowerCase();
        let route = this.getRoute();
        if (route) {
            this.fetchSuggestions(route, value).then((suggests) => {
                this.updateSuggestions(suggests);
            });
        } else {
            let suggests = this.$element.find('[data-auto-suggest-list]').data('auto-suggest-list');
            let data = [];
            for (let suggest of suggests) {
                if (suggest.toLowerCase().includes(value) && suggest != value) {
                    data.push(suggest);
                }
            }
            this.updateSuggestions(data);
        }
    }

    private fetchSuggestions(route: string, value: string): Promise<string[]>
    {
        let url = this.router.generate(route, {
            q: value,
            page: 1
        });

        if(this.source != null) {
            this.source.cancel();
        }

        this.source = axios.CancelToken.source();
        this.loading();
        return new Promise((resolve, reject) => {
            axios
                .get(url, {
                    cancelToken: this.source.token
                })
                .then(response => {
                    let data = [];
                    for (let entry of response.data.results) {
                        data.push(entry.text);
                    }
                    this.finishLoading();
                    resolve(data);
                })
                .catch(error => {
                    this.finishLoading();
                    reject(error);
                })
        });
    }

    private updateSuggestions(suggestions: string[])
    {
        suggestions.slice(10);
        suggestions.sort();

        let $list = this.$element.find('[data-auto-suggest-list]');
        $list.show();
        $list.html('');
        for (let suggest of suggestions) {
            let element = document.createElement("div");
            $(element).on('click', () => {
                this.$element.find('input').val(suggest);
                $list.hide();
            });
            element.innerText = suggest;
            $list.append(element);
        }
    }

    private removeList()
    {
        this.$element.find('[data-auto-suggest]').hide();
    }

    private finishLoading()
    {

    }

    private loading()
    {

    }
}
